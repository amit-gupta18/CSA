import { GoogleGenAI , Type } from "@google/genai";
const apikey = process.env.GEMINI_API_KEY;

const ai = new GoogleGenAI({apiKey: apikey!});
      
export default async function main() {
  const response = await ai.models.generateContent({
    model: "gemini-1.5-flash",
    contents: "Explain how AI works in a few words",
  });
  return response?.text;
}

export async function generatequestion(interests: string) {
  const schema = {
    type: Type.OBJECT,
    properties: {
      career: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
        },
        required: ["name", "description"],
      },
      questions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type:  Type.STRING },
            options: {
              type: Type.ARRAY,
              items: {
                type:  Type.OBJECT,
                properties: {
                  text: { type: Type.STRING },
                  correct: { type: Type.BOOLEAN },
                  imagePrompt: { type: Type.STRING },
                },
                required: ["text", "correct", "imagePrompt"],
              },
            },
          },
          required: ["question", "options"],
        },
      },
    },
    required: ["career", "questions"],
  }

  const prompt = `Based on the following interests: "${interests}", generate a career suggestion and a set of 10 questions that would test the user's aptitude for this career. Each question should have 4 options, with one correct answer, dont ask subjective questions which has ambiguity in the correct answer, ask questions which have a definite answer DONT ASK VISUAL QUESTIONS OR WHICH REQUIRES PICTURE TO ANSWER. Also, provide an image prompt for each option. Respond in the following JSON format:
  {
    "career": {
      "name": "Career Name",
      "description": "Brief description of the career"
    },
    "questions": [
      {
        "question": "Question text",
        "options": [
          {
            "text": "Option text",
            "correct": true/false,
            "imagePrompt": "Image prompt for this option"
          },
          ...
        ]
      },
      ...
    ]
  }`

  try {
    console.log("Prompt:", prompt);
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseSchema: schema,
        responseMimeType: "application/json"
      }
    });
    // console.log("Raw Result:", result.text);
    const generatedData = JSON.parse(result.text ?? '{}');
    // console.log("Generated Data:", generatedData);
    return generatedData;
  } catch (error) {
    console.error("Error generating career questions:", error);
    throw error;
  }
}