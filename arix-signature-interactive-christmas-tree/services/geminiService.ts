
import { GoogleGenAI } from "@google/genai";

// Strictly follow initialization guideline: const ai = new GoogleGenAI({apiKey: process.env.API_KEY});
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateHolidayBlessing = async (userPrompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate a short, extremely luxurious and poetic Christmas blessing or mantra for a person who wishes for: "${userPrompt}". 
      The tone should be 'Arix Signature' style: grand, cinematic, and elite. Limit to 30 words.`,
      config: {
        temperature: 0.9,
        topP: 0.95,
      }
    });
    
    // Using the .text property directly as per guidelines
    return response.text || "May your holiday be filled with the golden light of Arix.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "The stars of Arix shine upon your festive spirit.";
  }
};
