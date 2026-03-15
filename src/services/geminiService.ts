import { GoogleGenAI } from "@google/genai";
import { LifestyleData, ImpactScore } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function generateRecommendations(lifestyle: LifestyleData, scores: ImpactScore) {
  const prompt = `
    As a Futurist Sustainability Architect from the year 2050, analyze this lifestyle data and impact scores from the 2020s:
    Lifestyle: ${JSON.stringify(lifestyle)}
    Scores: ${JSON.stringify(scores)}
    
    Provide 4-5 ultra-futuristic, actionable, and mind-blowing sustainability recommendations that feel like they come from NASA or DeepMind.
    Focus on how these actions prevent specific future disasters or restore global ecosystems.
    Format your response as a JSON array of strings.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    
    const text = response.text;
    if (!text) throw new Error("No response text");

    // Extract JSON array from text
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as string[];
    }
    return [
      "Reduce meat consumption to lower carbon footprint.",
      "Switch to renewable energy sources for home electricity.",
      "Opt for public transport or cycling for daily commutes.",
      "Minimize single-use plastic and embrace zero-waste habits."
    ];
  } catch (error) {
    console.error("Error generating recommendations:", error);
    return [
      "Reduce meat consumption to lower carbon footprint.",
      "Switch to renewable energy sources for home electricity.",
      "Opt for public transport or cycling for daily commutes.",
      "Minimize single-use plastic and embrace zero-waste habits."
    ];
  }
}
