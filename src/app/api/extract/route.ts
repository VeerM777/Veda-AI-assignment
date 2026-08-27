import { NextResponse } from 'next/server';
import { GoogleGenAI, Type } from '@google/genai';
import { ExtractionResult } from '@/types';

const extractionResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary: {
      type: Type.OBJECT,
      properties: {
        totalQuestions: { type: Type.INTEGER },
        totalMaxMarks: { type: Type.NUMBER },
        totalObtainedMarks: { type: Type.NUMBER },
        answeredCount: { type: Type.INTEGER },
        unansweredCount: { type: Type.INTEGER },
        outOfOrderCount: { type: Type.INTEGER },
        percentageScore: { type: Type.NUMBER },
      },
      required: ['totalQuestions', 'totalMaxMarks', 'totalObtainedMarks', 'answeredCount', 'unansweredCount'],
    },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          questionNumber: { type: Type.STRING },
          parentQuestionNumber: { type: Type.STRING },
          questionText: { type: Type.STRING },
          maxMarks: { type: Type.NUMBER },
          obtainedMarks: { type: Type.NUMBER },
          status: { type: Type.STRING },
          aiFeedback: { type: Type.STRING },
          answerLocations: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                pageNumber: { type: Type.INTEGER },
                label: { type: Type.STRING },
                boundingBox: {
                  type: Type.OBJECT,
                  properties: {
                    ymin: { type: Type.INTEGER },
                    xmin: { type: Type.INTEGER },
                    ymax: { type: Type.INTEGER },
                    xmax: { type: Type.INTEGER },
                  },
                  required: ['ymin', 'xmin', 'ymax', 'xmax'],
                },
              },
              required: ['pageNumber', 'boundingBox'],
            },
          },
        },
        required: ['id', 'questionNumber', 'questionText', 'maxMarks', 'obtainedMarks', 'status', 'aiFeedback', 'answerLocations'],
      },
    },
    unmappedAnswers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          pageNumber: { type: Type.INTEGER },
          detectedText: { type: Type.STRING },
          note: { type: Type.STRING },
          boundingBox: {
            type: Type.OBJECT,
            properties: {
              ymin: { type: Type.INTEGER },
              xmin: { type: Type.INTEGER },
              ymax: { type: Type.INTEGER },
              xmax: { type: Type.INTEGER },
            },
            required: ['ymin', 'xmin', 'ymax', 'xmax'],
          },
        },
        required: ['id', 'pageNumber', 'detectedText', 'boundingBox'],
      },
    },
  },
  required: ['summary', 'questions'],
};

/** Helper to try Groq Vision models */
async function callGroqOCR(groqKey: string, base64Data: string, mimeType: string, promptText: string): Promise<string> {
  const modelsToTry = ['qwen/qwen3.8-27b', 'qwen/qwen3.6-27b'];

  for (const model of modelsToTry) {
    try {
      const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${groqKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: promptText },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:${mimeType};base64,${base64Data}`,
                  },
                },
              ],
            },
          ],
          temperature: 0.1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content || '';
        if (content) return content;
      } else if (res.status === 429) {
        console.warn(`Groq Rate Limit (429) on model ${model}`);
      } else {
        console.warn(`Groq API model ${model} returned status: ${res.status}`);
      }
    } catch (e) {
      console.warn(`Error trying Groq model ${model}:`, e);
    }
  }
  return '';
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const geminiKey = (formData.get('apiKey') as string) || process.env.GEMINI_API_KEY;
    const groqKey = (formData.get('groqApiKey') as string) || process.env.GROQ_API_KEY;

    const questionPapers = formData.getAll('questionPaper') as File[];
    const answerSheets = formData.getAll('answerSheet') as File[];

    if (questionPapers.length === 0 || answerSheets.length === 0) {
      return NextResponse.json(
        { error: 'Both Question Paper and Answer Sheet files are required.' },
        { status: 400 }
      );
    }

    // Convert all question papers to base64
    const qpBase64List = await Promise.all(questionPapers.map(async (qp) => {
      const buffer = Buffer.from(await qp.arrayBuffer());
      return buffer.toString('base64');
    }));

    // Convert all answer sheets to base64
    const asBase64List = await Promise.all(answerSheets.map(async (as) => {
      const buffer = Buffer.from(await as.arrayBuffer());
      return buffer.toString('base64');
    }));

    let groqExtractedText = '';

    // Step 1: Extract text using Groq's high-speed OCR vision models
    if (groqKey) {
      try {
        console.log('Calling Groq Vision OCR for document text extraction...');

        let qpText = '';
        for (let i = 0; i < questionPapers.length; i++) {
          const qp = questionPapers[i];
          const isQPImage = qp.type ? qp.type.startsWith('image/') : !qp.name?.toLowerCase().endsWith('.pdf');
          if (isQPImage) {
            if (i > 0) await new Promise((r) => setTimeout(r, 600));
            console.log(`Extracting QP image ${i + 1}/${questionPapers.length}`);
            const mimeType = qp.type || (qp.name?.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
            const text = await callGroqOCR(
              groqKey,
              qpBase64List[i],
              mimeType,
              `Perform high-accuracy OCR on this question paper image page ${i + 1}. Extract every single question text, question number, and max marks in printed order.`
            );
            if (text) qpText += `\n--- Question Paper Page ${i + 1} ---\n${text}`;
          }
        }

        let asText = '';
        for (let i = 0; i < answerSheets.length; i++) {
          const as = answerSheets[i];
          const isASImage = as.type ? as.type.startsWith('image/') : !as.name?.toLowerCase().endsWith('.pdf');
          if (isASImage) {
            if (i > 0 || questionPapers.length > 0) await new Promise((r) => setTimeout(r, 600));
            console.log(`Extracting AS image ${i + 1}/${answerSheets.length}`);
            const mimeType = as.type || (as.name?.toLowerCase().endsWith('.png') ? 'image/png' : 'image/jpeg');
            const text = await callGroqOCR(
              groqKey,
              asBase64List[i],
              mimeType,
              `Perform high-accuracy handwriting OCR on this student answer sheet image page ${i + 1}. Extract all handwritten margin tags (e.g. Q3], Q1, Q2) and answer text carefully.`
            );
            if (text) asText += `\n--- Answer Sheet Page ${i + 1} ---\n${text}`;
          }
        }

        if (qpText || asText) {
          groqExtractedText = `
[Groq High-Speed Vision OCR Question Paper Text]:
${qpText}

[Groq High-Speed Vision OCR Answer Sheet Text]:
${asText}
          `;
          console.log('Groq Vision OCR completed successfully.');
        }
      } catch (err) {
        console.error('Error calling Groq API:', err);
      }
    }

    // Step 2: Pass everything to Gemini for grading, mapping, and bounding box coordinate calculations
    if (!geminiKey) {
      throw new Error('Google Gemini API Key is required for grading and mapping.');
    }

    const ai = new GoogleGenAI({ apiKey: geminiKey });

    const promptText = `
You are an expert Educational Evaluator, Cognitive Assessment Specialist, and Precision Answer Mapper for VedaAI Teacher's Toolkit.
Analyze the attached Question Paper pages and Student Handwritten Answer Sheet pages.

${groqExtractedText ? `High-Speed Groq Vision OCR Pre-extracted text: \n${groqExtractedText}\n\n` : ''}

========================================================================
CRITICAL RULE 1: STRICT QUESTION NUMBERING FROM MARGIN ONLY (NOT ANSWER BODY)
========================================================================
- READ THE HANDWRITTEN MARGIN TAG ONLY TO IDENTIFY QUESTION NUMBERS!
- NEVER extract or infer question numbers from words, bullet points, or prompt names written inside the student's answer body text (e.g. "Prompt A", "Prompt B", "i)", "a)", "b)" written inside paragraph text).
- If the Question Paper lists Question 3 as a single question, and the student writes "Q3]" in the margin, Question 3 is ONE SINGLE UNIFIED QUESTION ("Q3").
  - DO NOT split Question 3 into separate entries like "Q3 A", "Q3 B", "Q3 C", "Q3 D", "Q3 E"!
  - The bounding box for Question 3 MUST cover the ENTIRE handwritten block for Question 3, from the top margin label "Q3]" all the way down to the last line of the Question 3 answer.

========================================================================
RULE 2: BLOOM'S TAXONOMY FOR EVALUATION & GRADING
========================================================================
Evaluate every student response using Bloom's Cognitive Taxonomy. Assess the cognitive depth required by each question and compare it to the student's demonstrated cognitive level:
1. Remembering (Recall facts, definitions, terms)
2. Understanding (Explain ideas, summarize, interpret concepts)
3. Applying (Use knowledge in new situations, execute, solve)
4. Analyzing (Draw connections, compare/contrast, break down components, identify ethical concerns or mechanisms)
5. Evaluating (Justify decisions, assess tradeoffs, critique with evidence)
6. Creating (Synthesize, design, propose new solutions or strategies)

IN YOUR 'aiFeedback' FOR EACH QUESTION:
- Explicitly state the Bloom's Cognitive Level targeted by the question and achieved by the student (e.g. "Bloom's Level: Analyzing & Evaluating").
- Highlight what the student demonstrated well (e.g. "Accurately identified ethical concerns [Analyzing]").
- State clearly any missing cognitive elements that caused mark deductions (e.g. "Slight deduction under [Evaluating]: Lacks depth in justifying long-term safeguards.").
- Keep feedback professional, encouraging, concise, and structured.

========================================================================
RULE 3: OFFICIAL SUB-QUESTIONS (ONLY WHEN EXPLICIT ON QUESTION PAPER & MARGIN)
========================================================================
- Only create sub-question entries (e.g. "3a", "3b" or "11a", "11b") IF:
  1. The Question Paper explicitly has numbered sub-parts (e.g. Q3(a), Q3(b)), AND
  2. The student explicitly writes "3a", "3b" in the handwritten margin.
- If a question is listed as Question 3 on the paper and the student writes "Q3" in the margin, keep it as ONE single question entry "3" (or "Q3").

========================================================================
RULE 4: PRECISE BOUNDING BOX COORDINATES (0 to 1000 Normalized Scale)
========================================================================
- Output exact bounding box coordinates (ymin, xmin, ymax, xmax) on a 0-1000 scale for each handwritten answer on the student's answer sheet.
- For Question 3 (or any single main question), start ymin at the top of the handwritten margin label (e.g., Q3]) and end ymax at the bottom line of the entire Question 3 response block (enclosing all bullet points / sub-prompts in one box).
- DO NOT overlap with top administrative header forms (Student Roll No, College Name, Marks Summary Grid). Ignore student administrative headers!
    `;

    // Construct content parts for Gemini
    const contentParts: any[] = [{ text: promptText }];

    // Append Question Paper pages
    questionPapers.forEach((qp, idx) => {
      contentParts.push({
        inlineData: {
          mimeType: qp.type || 'application/pdf',
          data: qpBase64List[idx],
        }
      });
    });

    // Append Answer Sheet pages
    answerSheets.forEach((as, idx) => {
      contentParts.push({
        inlineData: {
          mimeType: as.type || 'application/pdf',
          data: asBase64List[idx],
        }
      });
    });

    const jsonText = await callGeminiWithRetryAndFallback(ai, contentParts);
    const parsedData: ExtractionResult = JSON.parse(jsonText);
    return NextResponse.json(parsedData);
  } catch (error: any) {
    console.error('Error in /api/extract:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during extraction.' },
      { status: 500 }
    );
  }
}

/** Helper to execute Gemini requests with automatic exponential backoff retries & model fallbacks when under high demand (429 / 503) */
async function callGeminiWithRetryAndFallback(ai: GoogleGenAI, contentParts: any[]) {
  const modelsToTry = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-1.5-flash',
    'gemini-2.5-pro',
  ];

  let lastError: any = null;

  for (const modelName of modelsToTry) {
    for (let attempt = 1; attempt <= 3; attempt++) {
      try {
        console.log(`Calling Gemini model ${modelName} (Attempt ${attempt})...`);
        const response = await ai.models.generateContent({
          model: modelName,
          contents: [{ role: 'user', parts: contentParts }],
          config: {
            responseMimeType: 'application/json',
            responseSchema: extractionResponseSchema,
            temperature: 0.1,
          },
        });

        const jsonText = response.text;
        if (jsonText && jsonText.trim().length > 0) {
          console.log(`Successfully generated extraction using ${modelName}`);
          return jsonText;
        }
      } catch (err: any) {
        lastError = err;
        const errString = String(err?.message || err);
        const isHighDemand =
          errString.includes('429') ||
          errString.includes('503') ||
          errString.includes('RESOURCE_EXHAUSTED') ||
          errString.includes('overloaded') ||
          errString.includes('high demand') ||
          errString.includes('Quota exceeded');

        if (isHighDemand) {
          const backoffMs = attempt * 1500;
          console.warn(`Gemini ${modelName} high demand / rate limit (attempt ${attempt}). Retrying in ${backoffMs}ms...`);
          await new Promise((r) => setTimeout(r, backoffMs));
        } else {
          console.warn(`Gemini ${modelName} error: ${errString}`);
          break;
        }
      }
    }
  }

  throw lastError || new Error('All AI models are currently busy. Please retry in a few moments.');
}
