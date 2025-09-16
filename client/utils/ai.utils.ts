// utils/ai.utils.ts
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY!,
});

export async function analyzePersonality(quiz: any[], answers: { [key: string]: any }) {
  // Build context string (question + chosen option text)
  const context = quiz
    .map((q) => {
      const ans = answers[q.id];
      if (!ans) return null;

      if (Array.isArray(ans)) {
        const chosen = ans
          .map((a: string) => q.options.find((o: any) => o.value === a)?.label || a)
          .join(", ");
        return `${q.question}\nAnswer: ${chosen}`;
      } else {
        const chosen = q.options.find((o: any) => o.value === ans)?.label || ans;
        return `${q.question}\nAnswer: ${chosen}`;
      }
    })
    .filter(Boolean)
    .join("\n\n");

  const prompt = `
The following are answers from a psychometric test:

${context}

Please analyze the person’s personality traits.
`;

  // Define structured schema
  const schema = {
    type: Type.OBJECT,
    properties: {
      personalitySummary: { type: Type.STRING },
      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
      behavioralTendencies: { type: Type.ARRAY, items: { type: Type.STRING } },
    },
    required: ["personalitySummary", "strengths", "weaknesses", "behavioralTendencies"],
  };

  try {
    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        responseSchema: schema,
        responseMimeType: "application/json",
      },
    });

    const generatedData = JSON.parse(result.text ?? "{}");
    console.log("Generated Personality Analysis:", generatedData);
    return generatedData;
  } catch (error) {
    console.error("Error generating personality analysis:", error);
    throw error;
  }
}
