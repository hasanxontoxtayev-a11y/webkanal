import { GoogleGenAI, Type, Schema } from "@google/genai";

export interface ThumbnailEvaluationResult {
  predictedCtrScore: number;
  contrastRating: "POOR" | "AVERAGE" | "EXCELLENT";
  contrastFeedback: string;
  readabilityRating: "POOR" | "AVERAGE" | "EXCELLENT";
  readabilityFeedback: string;
  focalPointAnalysis: string;
  actionableFixes: string[];
}

export interface CommentDraftResult {
  detectedLanguage: string;
  draftReply: string;
  tone: string;
}

export class GeminiService {
  private static ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || "",
  });

  /**
   * Multimodal Vision Evaluation for YouTube Thumbnails
   */
  public static async evaluateThumbnail(
    imageBuffer: Buffer,
    mimeType: string = "image/jpeg"
  ): Promise<ThumbnailEvaluationResult> {
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const prompt = `You are an elite YouTube Growth Consultant and Thumbnail Designer for top-tier creators.
Analyze this video thumbnail cover with deep visual scrutiny:
1. Contrast: Evaluate foreground vs background separation, lighting, and vibrancy.
2. Readability: Scrutinize text size, font weight, overlay contrast, and legibility on mobile screens (where 70%+ of YouTube views occur).
3. Focal Point: Rule of thirds, human facial expressions/eyes, visual hook, and curiosity gaps.
4. CTR Score: Predict Click-Through Rate effectiveness on a strict scale of 1 to 100.
5. Actionable Fixes: Give 3 to 5 clear, high-impact changes the creator can make to instantly boost CTR.`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        predictedCtrScore: {
          type: Type.INTEGER,
          description: "Predicted Click-Through Rate score from 1 to 100",
        },
        contrastRating: {
          type: Type.STRING,
          enum: ["POOR", "AVERAGE", "EXCELLENT"],
        },
        contrastFeedback: {
          type: Type.STRING,
          description: "Detailed critique of color contrast and luminosity",
        },
        readabilityRating: {
          type: Type.STRING,
          enum: ["POOR", "AVERAGE", "EXCELLENT"],
        },
        readabilityFeedback: {
          type: Type.STRING,
          description: "Critique of typography readability on mobile viewports",
        },
        focalPointAnalysis: {
          type: Type.STRING,
          description: "Critique of visual hierarchy, subject prominence, and emotions",
        },
        actionableFixes: {
          type: Type.ARRAY,
          items: { type: Type.STRING },
          description: "3 to 5 concrete action steps to improve the thumbnail",
        },
      },
      required: [
        "predictedCtrScore",
        "contrastRating",
        "contrastFeedback",
        "readabilityRating",
        "readabilityFeedback",
        "focalPointAnalysis",
        "actionableFixes",
      ],
    };

    const imagePart = {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType,
      },
    };

    const response = await this.ai.models.generateContent({
      model,
      contents: [prompt, imagePart],
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.2,
      },
    });

    if (!response.text) {
      throw new Error("Failed to generate thumbnail evaluation from Gemini Vision.");
    }

    return JSON.parse(response.text) as ThumbnailEvaluationResult;
  }

  /**
   * Multilingual Comment Copilot drafting replies in the source comment's language
   */
  public static async draftCommentReply(
    commentText: string,
    channelNicheOrTone: string = "Friendly, authentic, encouraging, and engaging creator tone"
  ): Promise<CommentDraftResult> {
    const model = process.env.GEMINI_MODEL || "gemini-2.0-flash";

    const prompt = `You are the creator's AI copilot for answering YouTube audience comments.
Task:
1. Detect the exact language of the user's comment (e.g., French, Hindi, Russian, Uzbek, Spanish, English, etc.).
2. Draft a thoughtful, authentic reply written IN THAT EXACT SAME LANGUAGE.
3. Keep the creator voice: "${channelNicheOrTone}".
4. Encourage further community engagement with a natural conversation flow.`;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        detectedLanguage: {
          type: Type.STRING,
          description: "Detected ISO code or language name (e.g. 'French', 'Russian')",
        },
        draftReply: {
          type: Type.STRING,
          description: "The draft response text in the detected source language",
        },
        tone: {
          type: Type.STRING,
          description: "Description of the chosen reply tone",
        },
      },
      required: ["detectedLanguage", "draftReply", "tone"],
    };

    const response = await this.ai.models.generateContent({
      model,
      contents: [prompt, commentText],
      config: {
        responseMimeType: "application/json",
        responseSchema,
        temperature: 0.6,
      },
    });

    if (!response.text) {
      throw new Error("Failed to generate comment draft from Gemini.");
    }

    return JSON.parse(response.text) as CommentDraftResult;
  }

  /**
   * Conversational YouTube Creator & TubePilot Assistant (Optimized for ultra-fast response)
   */
  public static async askCreatorAssistant(
    userQuery: string,
    language: "uz" | "ru" | "en" = "uz"
  ): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is not defined");
    }

    const systemPrompt = `You are TubePilot AI — the elite YouTube Growth Consultant and Official Companion Bot for TubePilot AI (a cutting-edge SaaS competitor to VidIQ).
Your mission:
1. Provide master-level YouTube advice (CTR optimization, SEO, viral titles, thumbnail psychology, VPH velocity, AdSense RPM, sponsorship deals, shorts vs long-form strategy).
2. Answer any question about TubePilot AI platform (Comment Copilot human-in-the-loop approvals, Gemini Vision thumbnail evaluations, audience peak posting heatmap, 1-click channel sync).
3. Always respond naturally and fluently in the requested language: ${language.toUpperCase()} (Uzbek for 'uz', Russian for 'ru', English for 'en').
4. Keep your answer practical, encouraging, structured with clean Markdown bullets, and directly actionable for creators. Keep length within 3-4 concise points so response is rapid.`;

    const candidateModels = ["gemini-3.6-flash", "gemini-3.8-flash", "gemini-3.7-flash"];

    for (const model of candidateModels) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${systemPrompt}\n\nFoydalanuvchi savoli: ${userQuery}` }
                  ]
                }
              ],
              generationConfig: {
                maxOutputTokens: 500,
                temperature: 0.6
              }
            })
          }
        );

        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) {
          return text;
        }
      } catch (e) {
        console.warn(`Model ${model} failed, trying next...`);
      }
    }

    return "YouTube algoritmlari bo'yicha maslahat: Tomoshabinlarni videongizda ko'proq ushlab turing va yuqori kontrastli (CTR 8%+) muqovalardan foydalaning!";
  }
}

