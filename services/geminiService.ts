import { GoogleGenAI } from "@google/genai";
import { Platform, Tone, Length } from "../types";

// Initialize the client with the API key from environment variables
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface GenerateParams {
  idea: string;
  platform: Platform;
  tone: Tone;
  length: Length;
}

export const generatePostContent = async ({ idea, platform, tone, length }: GenerateParams): Promise<string> => {
  try {
    const prompt = `
      You are an expert social media manager and copywriter. 
      Your task is to write a high-quality post based on the user's idea.

      Configuration:
      - Platform: ${platform}
      - Tone: ${tone}
      - Approximate Length: ${length}
      
      User's Idea/Topic:
      "${idea}"

      Guidelines:
      - Adapt the formatting (hashtags, spacing, emojis) specifically for ${platform}.
      - If it's Twitter, keep it within character limits or create a thread structure.
      - If it's LinkedIn, focus on professional engagement and readability.
      - If it's Instagram, include a visually descriptive caption and relevant hashtags block at the end.
      - Do not include conversational filler like "Here is your post". Just output the post content directly.
      - Return plain text with markdown formatting where appropriate (bolding, lists).
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are a world-class writing assistant specializing in social media and content marketing.",
        temperature: 0.7, // Slightly creative but focused
      }
    });

    const text = response.text;
    
    if (!text) {
      throw new Error("No content generated from the model.");
    }

    return text;

  } catch (error) {
    console.error("Error generating post:", error);
    throw new Error("Failed to generate post. Please check your connection and try again.");
  }
};

export const refinePostContent = async (originalContent: string, instruction: string): Promise<string> => {
    try {
        const prompt = `
          Original Post:
          "${originalContent}"

          User Instruction for Refinement:
          "${instruction}"

          Task: Rewrite the original post implementing the user's instruction. Keep the core message but adjust style/length/content as requested.
        `;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });

        return response.text || originalContent;

    } catch (error) {
        console.error("Error refining post:", error);
        throw error;
    }
}