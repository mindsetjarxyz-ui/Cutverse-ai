import { GoogleGenAI, Type } from "@google/genai";

// Helper to safely get the API key without crashing the app on load if process is undefined
const getApiKey = () => {
  try {
    return process.env.API_KEY || '';
  } catch (e) {
    console.warn("process.env is not accessible. API calls will fail unless polyfilled.");
    return '';
  }
};

// Initialize the client lazily to avoid top-level crashes
let aiInstance: GoogleGenAI | null = null;

const getAiClient = () => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: getApiKey() });
  }
  return aiInstance;
};

export const generateText = async (
  prompt: string, 
  systemInstruction?: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing. Please configure process.env.API_KEY.");
  }

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: systemInstruction,
      }
    });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Text Generation Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("API Key is missing.");
  }

  try {
    const ai = getAiClient();
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: prompt,
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return "";
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};

export const editImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key Missing");

  try {
    const ai = getAiClient();
    const parts = [
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      },
      { text: prompt }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts },
    });

    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      const parts = candidates[0].content.parts;
      for (const part of parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return "";
  } catch (error) {
    console.error("Image Edit Error:", error);
    throw error;
  }
};

// Generic multimodal function (Text/Image/Audio -> Text)
export const generateMultimodal = async (
  prompt: string,
  mediaBase64?: string,
  mimeType?: string,
  systemInstruction?: string
): Promise<string> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key Missing");

  try {
    const ai = getAiClient();
    const parts: any[] = [{ text: prompt }];
    
    if (mediaBase64 && mimeType) {
      parts.push({
        inlineData: {
          mimeType: mimeType,
          data: mediaBase64
        }
      });
    }

    // Select model based on input type
    const isAudio = mimeType?.startsWith('audio');
    const model = isAudio 
      ? 'gemini-2.5-flash-native-audio-preview-12-2025' 
      : 'gemini-3-flash-preview';

    const response = await ai.models.generateContent({
      model: model,
      contents: { parts },
      config: {
        systemInstruction: systemInstruction
      }
    });
    
    return response.text || "Could not analyze content.";
  } catch (error) {
    console.error("Multimodal Error:", error);
    throw error;
  }
};

export const detectObjects = async (imageBase64: string, mimeType: string): Promise<string[]> => {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error("API Key Missing");

  try {
    const ai = getAiClient();
    const parts = [
      {
        inlineData: {
          mimeType: mimeType,
          data: imageBase64
        }
      },
      { text: "Identify the top distinct physical objects in this image. List them as simple singular nouns (e.g. 'cat', 'chair', 'tree'). Return only the JSON list." }
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Good for reasoning/JSON
      contents: { parts },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
             type: Type.STRING
          }
        }
      }
    });
    
    if (response.text) {
      try {
        const data = JSON.parse(response.text);
        return Array.isArray(data) ? data : [];
      } catch (e) {
        return [];
      }
    }
    return [];
  } catch (error) {
    console.error("Object Detection Error:", error);
    throw error;
  }
};