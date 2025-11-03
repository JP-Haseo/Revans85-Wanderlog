import { GoogleGenAI } from "@google/genai";

// Lazily initialize the client to avoid crashing on load if process.env is not available.
let ai: GoogleGenAI | null = null;

function getAiClient(): GoogleGenAI | null {
    if (ai) {
        return ai;
    }

    // Safely check if process and process.env are available in the environment
    const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;

    if (API_KEY) {
        ai = new GoogleGenAI({ apiKey: API_KEY });
        return ai;
    } else {
        console.warn("API_KEY is not available in this environment. Gemini features will be disabled.");
        return null;
    }
}


export const generatePostIdea = async (topic: string): Promise<string> => {
  const aiClient = getAiClient();
  if (!aiClient) return "API Key not configured. Please set up your API_KEY.";
  
  try {
    const response = await aiClient.models.generateContent({
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
  const aiClient = getAiClient();
  // Fallback to a placeholder if the client can't be initialized or an error occurs
  const fallbackImageUrl = `https://picsum.photos/seed/${prompt.replace(/\s/g, '')}/1200/675`;

  if (!aiClient) return fallbackImageUrl;
  
  try {
    const response = await aiClient.models.generateImages({
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
    return fallbackImageUrl;
  }
};