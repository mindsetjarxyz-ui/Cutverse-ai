import { GoogleGenAI } from "@google/genai";

// Initialize AI for each request to ensure fresh state and correct API key access
const getAIClient = () => {
  let apiKey = '';
  try {
    apiKey = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY || '' : (window as any).process?.env?.API_KEY || '';
  } catch (e) {
    console.warn("Could not access process.env.API_KEY securely.");
  }
  
  if (!apiKey) {
    console.warn("Gemini API Key is missing. Ensure the environment is configured correctly.");
  }
  
  return new GoogleGenAI({ apiKey });
};

export const generateText = async (prompt: string, systemInstruction?: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction || "You are Cutverse AI, a helpful assistant. Avoid using markdown symbols like * or # in your output.",
      },
    });
    return response.text || '';
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw new Error("Unable to generate text at this time.");
  }
};

export const generateImage = async (prompt: string, aspectRatio: string = "1:1", style?: string): Promise<string> => {
  try {
    const ai = getAIClient();
    const styleSuffix = style && style !== 'None' ? `. Style: ${style}` : '';
    const finalPrompt = `${prompt}${styleSuffix}`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any,
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("No image generated.");
  } catch (error) {
    console.error("Gemini Image Error:", error);
    throw error;
  }
};

export const upscaleImageService = async (imageBase64: string, mimeType: string, aspectRatio: string = "1:1"): Promise<string> => {
  try {
    const ai = getAIClient();
    const base64Data = imageBase64.includes(',') ? imageBase64.split(',')[1] : imageBase64;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Data, mimeType } },
          { text: `SYSTEM TASK: UPSCALING AND RESTORATION.
          ACTUAL INPUT: The provided image.
          INSTRUCTIONS: 
          1. Act as a high-fidelity image upscaler. 
          2. Increase resolution, sharpen edges, and remove noise from the EXACT image provided.
          3. DO NOT change the composition.
          4. DO NOT zoom in or crop the image. 
          5. DO NOT add new objects or reimagine the scene.
          6. The output MUST maintain the exact same framing as the input. 
          7. Every pixel in the output should be a higher-quality version of the corresponding pixel in the input.
          8. Ensure the entire original image area is visible in the ${aspectRatio} output. If the ratio doesn't match perfectly, use neutral padding instead of cropping.` }
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio as any
        }
      }
    });

    const part = response.candidates?.[0]?.content?.parts.find(p => p.inlineData);
    if (part?.inlineData) {
      return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
    }
    throw new Error("Upscaling failed.");
  } catch (error) {
    console.error("Gemini Upscale Error:", error);
    throw error;
  }
};
