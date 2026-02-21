// AI Service for Cutverse AI using Bytez SDK
// Direct integration with bytez.js SDK

import Bytez from "bytez.js";

const API_KEY = "cd8fe321d2c8864355dcc151f435f41f";

// Initialize Bytez SDK
const sdk = new Bytez(API_KEY);

// Clean text by removing restricted characters
export function cleanText(text: string): string {
  return text
    .replace(/#/g, '')
    .replace(/\*/g, '')
    .replace(/'/g, '')
    .replace(/`/g, '')
    .replace(/—/g, ' - ')
    .trim();
}

// Format text - simple clean output without styling
export function formatOutputText(text: string): string {
  if (!text) return '';
  
  const cleaned = cleanText(text);
  
  // Just return clean text with basic formatting
  // Convert paragraph breaks to proper spacing
  let result = cleaned.replace(/\n\n+/g, '\n\n');
  
  return result;
}

// Text Generation using Bytez SDK with gpt-4o
export async function generateText(prompt: string, systemPrompt?: string): Promise<{ error: string | null; output: string }> {
  try {
    // Choose gpt-4o model
    const model = sdk.model("openai/gpt-4o");
    
    // Build messages array
    const messages: Array<{ role: string; content: string }> = [];
    
    const defaultSystem = `You are a professional AI writing assistant. Follow these rules strictly:
- NEVER use hash/pound symbols (#) in your output
- NEVER use asterisks (*) in your output  
- NEVER use single quotes or backticks in your output
- NEVER use markdown formatting
- Write clean plain text only
- Use proper paragraph breaks with blank lines between sections
- Write section headings on their own line followed by a colon if needed
- Keep text natural, well-structured, and easy to read
- If the user requests a specific language, write entirely in that language`;

    messages.push({ 
      role: "system", 
      content: systemPrompt ? `${defaultSystem}\n\n${systemPrompt}` : defaultSystem 
    });
    
    messages.push({ role: "user", content: prompt });
    
    // Send input to model using the SDK
    const result = await model.run(messages);
    
    // Check for errors
    if (result.error) {
      console.error('Bytez API error:', result.error);
      return { error: String(result.error), output: '' };
    }
    
    // Extract the text from the response
    let outputText = '';
    
    if (typeof result.output === 'string') {
      outputText = result.output;
    } else if (result.output?.choices?.[0]?.message?.content) {
      outputText = result.output.choices[0].message.content;
    } else if (result.output?.content) {
      outputText = result.output.content;
    } else if (result.output?.message?.content) {
      outputText = result.output.message.content;
    } else if (Array.isArray(result.output)) {
      outputText = result.output.map((item: any) => {
        if (typeof item === 'string') return item;
        return item.content || item.text || item.message?.content || '';
      }).join('');
    } else if (typeof result.output === 'object' && result.output !== null) {
      const output = result.output as any;
      if (output.text) {
        outputText = output.text;
      } else if (output.response) {
        outputText = output.response;
      } else {
        try {
          outputText = JSON.stringify(result.output);
        } catch {
          outputText = String(result.output);
        }
      }
    }
    
    if (!outputText) {
      return { error: 'No output received from API', output: '' };
    }
    
    return { error: null, output: cleanText(outputText) };
  } catch (err: any) {
    console.error('Text generation error:', err);
    return { error: err.message || 'Failed to generate text. Please try again.', output: '' };
  }
}

// Image Generation using Bytez SDK with stable-diffusion-xl-base-1.0
export async function generateImage(prompt: string): Promise<{ error: string | null; output: string }> {
  try {
    // Choose stable-diffusion-xl-base-1.0 model
    const model = sdk.model("stabilityai/stable-diffusion-xl-base-1.0");
    
    // Send input to model using the SDK
    const result = await model.run(prompt);
    
    // Check for errors
    if (result.error) {
      console.error('Bytez API error:', result.error);
      return { error: String(result.error), output: '' };
    }
    
    // Handle different response formats
    let imageData = '';
    
    if (result.output instanceof Blob) {
      imageData = URL.createObjectURL(result.output);
    } else if (typeof result.output === 'string') {
      imageData = result.output;
    } else if (result.output?.image) {
      imageData = result.output.image;
    } else if (result.output?.url) {
      imageData = result.output.url;
    } else if (result.output?.images?.[0]) {
      imageData = result.output.images[0];
    } else if (result.output?.base64) {
      imageData = `data:image/png;base64,${result.output.base64}`;
    } else if (Array.isArray(result.output) && result.output.length > 0) {
      const firstItem = result.output[0];
      if (firstItem instanceof Blob) {
        imageData = URL.createObjectURL(firstItem);
      } else if (typeof firstItem === 'string') {
        imageData = firstItem;
      } else if (firstItem?.url) {
        imageData = firstItem.url;
      } else if (firstItem?.image) {
        imageData = firstItem.image;
      }
    }
    
    // Ensure proper data URI format for base64
    if (imageData && !imageData.startsWith('http') && !imageData.startsWith('data:') && !imageData.startsWith('blob:')) {
      imageData = `data:image/png;base64,${imageData}`;
    }
    
    if (!imageData) {
      return { error: 'No image received from API', output: '' };
    }
    
    return { error: null, output: imageData };
  } catch (err: any) {
    console.error('Image generation error:', err);
    return { error: err.message || 'Failed to generate image', output: '' };
  }
}
