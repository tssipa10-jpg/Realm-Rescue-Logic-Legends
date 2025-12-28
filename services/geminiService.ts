import { GoogleGenAI } from "@google/genai";

const ai = process.env.API_KEY 
  ? new GoogleGenAI({ apiKey: process.env.API_KEY }) 
  : null;

export const getOracleWisdom = async (context: string): Promise<string> => {
  if (!ai) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve("The mists of the oracle are thick today... (API Key missing)");
      }, 1000);
    });
  }

  try {
    const model = 'gemini-3-flash-preview';
    const systemInstruction = "You are an ancient, mystical Oracle in a medieval fantasy game. Provide a short, cryptic but helpful hint (under 30 words) for the player's current puzzle situation.";
    
    const response = await ai.models.generateContent({
      model: model,
      contents: `The player is facing this challenge: ${context}. What is your wisdom?`,
      config: {
        systemInstruction: systemInstruction,
      }
    });

    return response.text || "The stars are silent.";
  } catch (error) {
    console.error("Oracle error:", error);
    return "The connection to the ethereal plane has been severed.";
  }
};