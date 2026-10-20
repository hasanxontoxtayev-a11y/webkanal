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

  /**
   * Conversational YouTube Creator & TubePilot Assistant (Optimized for sub-second rapid response)
   */
  public static async askCreatorAssistant(
    userQuery: string,
    language: "uz" | "ru" | "en" = "uz"
  ): Promise<string> {
    const qLower = userQuery.toLowerCase().trim();

    // Fast Instant Local Knowledge Engine (0ms response time for common creator queries)
    if (qLower.includes("ctr") || qLower.includes("muqova") || qLower.includes("oblojka") || qLower.includes("thumbnail")) {
      return language === "ru"
        ? "🎯 **TubePilot AI — CTR va Muqova Strategiyasi:**\n\n" +
          "• **Kontrast (Fon va Qahramon):** Obyektni fonga nisbatan yorqinroq qiling, kontur (rim light) qo'shing.\n" +
          "• **3 So'z Qoidasi:** Muqovadagi matn 3 so'zdan oshmasin va katta, qalin shriftda bo'lsin.\n" +
          "• **Vaqt Belgisi:** O'ng pastki burchakni bo'sh qoldiring (YouTube vaqt belgisi qoplab qo'ymasin).\n" +
          "• **CTR Maqsadi:** Browse oqimidan tavsiyalarga chiqish uchun 7.5% - 10% CTR'ga intiling."
        : language === "en"
        ? "🎯 **TubePilot AI — Thumbnail & CTR Strategy:**\n\n" +
          "• **Contrast & Pop:** Ensure foreground subject is separated from background with distinct lighting.\n" +
          "• **3-Word Limit:** Large, bold text under 3 words designed for small smartphone screens.\n" +
          "• **Safe Zones:** Keep the bottom-right corner empty to avoid timestamp overlap.\n" +
          "• **Target:** Aim for 8%+ CTR in Browse features for rapid algorithmic pickup."
        : "🎯 **TubePilot AI — CTR va Muqova Strategiyasi:**\n\n" +
          "• **Kontrast (Fon va Qahramon):** Asosiy obyekt yoki yuzni fonga nisbatan yorqinroq qiling.\n" +
          "• **3 So'z Qoidasi:** Muqovadagi matn 3 so'zdan oshmasin va smartfonda o'qiladigan yirik shriftda bo'lsin.\n" +
          "• **Xavfsiz Hudud:** O'ng pastki burchakni bo'sh qoldiring (YouTube 00:00 vaqt belgisi qoplab qo'ymasin).\n" +
          "• **Maqsad:** Browse tavsiyalariga chiqish uchun 8%+ CTR natijasini ko'zlang.";
    }

    if (qLower.includes("algoritm") || qLower.includes("tavsiya") || qLower.includes("prosmotr") || qLower.includes("views") || qLower.includes("vph")) {
      return language === "ru"
        ? "⚡ **TubePilot AI — YouTube Algoritmlari & VPH Tezligi:**\n\n" +
          "• **Dastlabki 30 soniya (AVD):** Tomoshabinlarning kamida 65-70% qismini birinchi 30 soniyada ushlab qoling.\n" +
          "• **VPH Tezligi:** Video chiqqanidan keyingi birinchi 2-3 soatdagi ko'rishlar tezligi tavsiyaga tushishni belgilaydi.\n" +
          "• **Kopilot:** TubePilot avtonom izohlar tizimi orqali har bir yangi izohga tezkor javob berib, jalb qilishni (engagement) oshiring."
        : "⚡ **TubePilot AI — YouTube Algoritmlari & VPH Tezligi:**\n\n" +
          "• **Dastlabki 30 soniya (AVD):** Tomoshabinlarning kamida 65-70% qismini dastlabki 30 soniyada ushlab qoling.\n" +
          "• **VPH (Views Per Hour):** Yangi video chiqqan paytda obunachilarni tezroq jalb qilish algoritmni uyg'otadi.\n" +
          "• **Interaktivlik:** Har bir izohga TubePilot orqali tezkor javob qaytaring — bu videoni ko'proq tavsiyaga chiqaradi.";
    }

    if (qLower.includes("daromad") || qLower.includes("pul") || qLower.includes("rpm") || qLower.includes("cpm") || qLower.includes("monetizatsiya")) {
      return language === "ru"
        ? "💰 **TubePilot AI — AdSense RPM & Daromad Optimallashtirish:**\n\n" +
          "• **Video davomiyligi:** 8 daqiqadan uzun videolarda Mid-roll (o'rtadagi) reklamalarni to'g'ri joylashtiring.\n" +
          "• **Auditoriya Geografiyasi:** AQSh va Yevropa auditoriyasi RPM'ni 5x - 10x gacha oshiradi.\n" +
          "• **Homiylik:** 10,000+ faol ko'rishlar bazasi bilan brendlarga integratsiya taklif qiling."
        : "💰 **TubePilot AI — AdSense RPM & Daromad:**\n\n" +
          "• **8+ daqiqalik videolar:** Videongiz 8 daqiqadan oshsa, o'rtasiga qo'shimcha reklama (Mid-roll) qo'yish imkoni ochiladi.\n" +
          "• **Yuqori RPM Mavzulari:** Moliya, texnologiya, biznes mavzularida reklama narxi 3-5 barobar yuqori bo'ladi.\n" +
          "• **Homiylik salohiyati:** TubePilot tahlil paneli orqali har bir videongizning homiylik narxini bilib oling.";
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      const systemPrompt = `You are TubePilot AI YouTube Growth Consultant. Answer in ${language.toUpperCase()} within 3 bullets:`;
      const candidateModels = ["gemini-3.8-flash", "gemini-2.5-flash"];

      for (const model of candidateModels) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 3500); // 3.5s strict timeout

          const res = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              signal: controller.signal,
              body: JSON.stringify({
                contents: [{ parts: [{ text: `${systemPrompt}\n\nSavol: ${userQuery}` }] }],
                generationConfig: { maxOutputTokens: 300, temperature: 0.6 }
              })
            }
          );
          clearTimeout(timeoutId);

          const data = await res.json();
          const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        } catch {
          // Timeout or network fallback
        }
      }
    }

    // High quality instant fallback
    return language === "ru"
      ? "💡 **TubePilot AI Эксперт:**\n\n" +
        "• **Удержание аудитории:** Удерживайте зрителей в первые 30 секунд (цель: более 60% удержания).\n" +
        "• **CTR Обложек:** Используйте высокий контраст и крупный читаемый текст для кликабельности от 8%+.\n" +
        "• **Регулярность:** Публикуйте видео в пиковые часы активности вашей аудитории."
      : "💡 **TubePilot AI Ekspert:**\n\n" +
        "• **Tomoshabin diqqati:** Videoning dastlabki 30 soniyasida asosiy qiziqishni bering (maqsad: 60%+ AVD).\n" +
        "• **Muqova CTR:** Ob'yekt va fon kontrastini oshirib, CTR ko'rsatkichini 8%+ darajaga ko'taring.\n" +
        "• **Muntazamlik:** Tomoshabinlar faol bo'lgan eng qulay vaqtlarda video e'lon qiling.";
  }
  }
}

