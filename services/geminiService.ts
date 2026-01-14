
import { GoogleGenAI, Type } from "@google/genai";
import { InvoiceItem } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    // Initializing Gemini API with the environment variable directly as per guidelines
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async scanInvoice(base64Image: string): Promise<InvoiceItem[]> {
    const model = 'gemini-3-flash-preview';
    
    const response = await this.ai.models.generateContent({
      model,
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/jpeg",
                data: base64Image
              }
            },
            {
              text: "Analyze this invoice and extract the items list. Return a JSON array of objects with 'itemName' (string), 'quantity' (number), and 'unitPrice' (number). If an item looks like a service or tax, ignore it. Only extract physical products."
            }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              itemName: { type: Type.STRING },
              quantity: { type: Type.NUMBER },
              unitPrice: { type: Type.NUMBER }
            },
            required: ["itemName", "quantity", "unitPrice"]
          }
        }
      }
    });

    try {
      const text = response.text || "[]";
      return JSON.parse(text);
    } catch (error) {
      console.error("Failed to parse Gemini response:", error);
      return [];
    }
  }
}

export const geminiService = new GeminiService();
