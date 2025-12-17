import { GoogleGenAI } from "@google/genai";
import { MediaData } from "../types";

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 */
export const editImageWithGemini = async (
  sourceImage: MediaData,
  prompt: string
): Promise<MediaData | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const cleanBase64 = sourceImage.url.includes('base64,')
      ? sourceImage.url.split('base64,')[1]
      : sourceImage.url;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: cleanBase64,
              mimeType: sourceImage.mimeType,
            },
          },
          {
            text: prompt,
          },
        ],
      },
    });

    if (response.candidates && response.candidates.length > 0) {
        const content = response.candidates[0].content;
        if (content && content.parts) {
            for (const part of content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    return {
                        type: 'image',
                        url: `data:${mimeType};base64,${part.inlineData.data}`,
                        mimeType: mimeType
                    };
                }
            }
        }
    }
    
    return null;
  } catch (error) {
    console.error("Error editing image with Gemini:", error);
    throw error;
  }
};
