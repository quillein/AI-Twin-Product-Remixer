import { GoogleGenAI } from "@google/genai";
import { ImageFile } from "../types";

// Helper to strip the prefix from base64 string (e.g., "data:image/png;base64,")
const cleanBase64 = (base64: string) => {
  return base64.split(',')[1];
};

export const generateRemixImage = async (
  twinImage: ImageFile,
  productImage: ImageFile,
  scenario: string
): Promise<string> => {
  // Using standard environment API key without the Pro-tier mandatory selection flow
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    Create a photorealistic, professional-grade product advertisement.
    
    INPUTS:
    1. First image provided is the "Model" (AI Twin).
    2. Second image provided is the "Product".
    
    TASK:
    Generate a high-quality image where the Model is interacting with the Product naturally.
    ${scenario ? `Specific Action: ${scenario}` : 'The model should be holding or applying the product in a way that highlights its use.'}
    
    CRITICAL CONSTRAINTS:
    - PRESERVE IDENTITY: The face, hair, and body structure must look exactly like the Model image.
    - PRESERVE PRODUCT: The product packaging, label, and shape must look exactly like the Product image.
    - AESTHETICS: Use a shallow depth of field (bokeh) to focus on the model and product. Add subtle natural skin texture and human flaws (pores, peach fuzz) to ensure realism. Lighting should be studio-quality, soft, and flattering.
    - COMPOSITION: Professional commercial photography.
    
    Output ONLY the image.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image', // Switched to Flash Image for general access without specific billing gates
      contents: {
        parts: [
          {
            text: prompt
          },
          {
            inlineData: {
              mimeType: twinImage.mimeType,
              data: cleanBase64(twinImage.base64)
            }
          },
          {
            inlineData: {
              mimeType: productImage.mimeType,
              data: cleanBase64(productImage.base64)
            }
          }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4", // Portrait standard for ads
          // imageSize is not supported in Flash Image model
        },
        // googleSearch tool is not supported in Flash Image model
      }
    });

    // Extract image from response
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
