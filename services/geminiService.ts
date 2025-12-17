import { GoogleGenAI } from "@google/genai";
import { ImageData } from "../types";

// Initialize the Gemini AI client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Edits an image based on a text prompt using Gemini 2.5 Flash Image.
 * 
 * @param sourceImage The original image data (base64 and mimeType).
 * @param prompt The user's text instruction for editing the image.
 * @returns A promise resolving to the edited image data or null if no image was generated.
 */
export const editImageWithGemini = async (
  sourceImage: ImageData,
  prompt: string
): Promise<ImageData | null> => {
  try {
    // Clean base64 string if it contains the data URL prefix
    const cleanBase64 = sourceImage.base64.includes('base64,')
      ? sourceImage.base64.split('base64,')[1]
      : sourceImage.base64;

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
      // Config not strictly needed for basic editing unless we want to force specific generation params
      // but keeping it simple as per "nano banana" usage
    });

    // Parse the response to find the image part
    if (response.candidates && response.candidates.length > 0) {
        const content = response.candidates[0].content;
        if (content && content.parts) {
            for (const part of content.parts) {
                if (part.inlineData && part.inlineData.data) {
                    const mimeType = part.inlineData.mimeType || 'image/png';
                    return {
                        base64: `data:${mimeType};base64,${part.inlineData.data}`,
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
