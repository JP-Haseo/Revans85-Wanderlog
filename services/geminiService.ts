
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // This is a fallback for development. The user's environment should provide the key.
  console.warn("API_KEY is not set. Gemini features will be disabled.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generatePostIdea = async (topic: string): Promise<string> => {
  if (!API_KEY) return "API Key not configured. Please set up your API_KEY.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Generate a short, engaging travel blog post idea about "${topic}". Make it sound like a personal anecdote or a helpful tip. Focus on a single paragraph.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating post idea:", error);
    return "Could not generate an idea at this time. Please try again later.";
  }
};

export const generatePostImage = async (prompt: string): Promise<string> => {
  if (!API_KEY) return "data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs="; // Transparent pixel
  
  try {
    const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `A beautiful, vibrant, high-quality photograph of ${prompt}. Travel photography style, cinematic lighting.`,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '16:9',
        },
    });

    if (response.generatedImages && response.generatedImages.length > 0) {
      const base64ImageBytes = response.generatedImages[0].image.imageBytes;
      return `data:image/jpeg;base64,${base64ImageBytes}`;
    }
    throw new Error("No image generated");
  } catch (error) {
    console.error("Error generating image:", error);
    // Fallback to a placeholder image on error
    return `https://picsum.photos/seed/${prompt.replace(/\s/g, '')}/1200/675`;
  }
};
