import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
dotenv.config();

const apikey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apikey! });

export async function generatequestion() {
  const schema = {
    type: Type.OBJECT,
    properties: {
      quiz: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.NUMBER },
            dimension: { type: Type.STRING },
            type: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  value: { type: Type.STRING },
                  label: { type: Type.STRING },
                },
                required: ["value", "label"],
              },
            },
          },
          required: ["id", "dimension", "type", "question", "options"],
        },
      },
    },
    required: ["quiz"],
  };


  const systemInstruction = "You are a psychometric evaluator that assesses an individual's personality traits, interests, and behavioral tendencies.Use principles from Big Five personality traits (OCEAN) and Holland's RIASEC career interests as guiding frameworks.Reflect the individual's strengths, motivations, and preferences, not just raw scores.Provide a balanced interpretation: highlight positive traits, areas of growth, and how their personality aligns with certain interests, roles, or environments.Keep the tone professional yet approachable, like a career counselor giving personalized insights.Avoid medical or clinical language; focus on self-awareness, career fit, and development opportunities.";

  const prompt = `Generate a 10-question psychometric quiz designed to assess an individual's 
                personality traits, interests, and behavioral tendencies. 
                Follow these guidelines:

                1. Cover multiple dimensions:
                  - Personality (Big Five traits: Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism).
                  - Interests (Holland's RIASEC: Realistic, Investigative, Artistic, Social, Enterprising, Conventional).
                  - Work/behavioral style (motivation, leadership, collaboration, adaptability).

                2. Question format:
                  - Use clear, everyday language.
                  - Prefer scenario-based or self-reflection questions.
                  - Mix Likert scale questions (e.g., 1 = Strongly Disagree to 5 = Strongly Agree) 
                    and multiple-choice interest-based questions.

                3. Style:
                  - Neutral, professional, and approachable.
                  - Avoid medical/clinical tone.
                  - Each question should only measure one thing at a time.

                Output format:
                Numbered list of 10 questions.
                For each, provide the question text + answer options.
                `

  try {
    // console.log("Prompt:", prompt);
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseSchema: schema,
        responseMimeType: "application/json",
        systemInstruction: systemInstruction
      }
    });
    // console.log("Raw Result:", result.text);
    const generatedData = JSON.parse(result.text ?? '{}');
    console.log("Generated Data:", generatedData);
    return generatedData;
  } catch (error) {
    console.error("Error generating career questions:", error);
    throw error;
  }
}
