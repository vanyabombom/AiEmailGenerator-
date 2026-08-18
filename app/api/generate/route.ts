import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import Groq from "groq-sdk";
import { generateMockEmailContent } from "@/lib/ai/mock-stream";
import { EmailTone, EmailLength } from "@/types";

export async function POST(req: Request) {
  let bodyParams: {
    topic?: string;
    tone?: EmailTone;
    length?: EmailLength;
    recipientName?: string;
    senderName?: string;
    additionalContext?: string;
    useMockMode?: boolean;
  } = {};

  try {
    bodyParams = await req.json();
    const { topic, tone, length, recipientName, senderName, additionalContext, useMockMode } = bodyParams;

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const groqKey = process.env.GROQ_API_KEY?.trim() || "";
    const googleKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() || "";

    // Determine active provider based on key format
    const isGroq = groqKey.startsWith("gsk_") || googleKey.startsWith("gsk_");
    const isGoogle = googleKey.startsWith("AIzaSy");
    const activeGroqKey = groqKey.startsWith("gsk_") ? groqKey : googleKey.startsWith("gsk_") ? googleKey : "";

    // If mock mode explicitly requested OR no valid key is configured
    if (useMockMode || (!isGroq && !isGoogle)) {
      const mockContent = generateMockEmailContent({
        topic,
        tone: (tone as EmailTone) || "professional",
        length: (length as EmailLength) || "medium",
        recipientName,
        senderName,
        additionalContext,
      });

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          const chunks = mockContent.split(" ");
          for (let i = 0; i < chunks.length; i++) {
            const word = chunks[i] + (i === chunks.length - 1 ? "" : " ");
            controller.enqueue(encoder.encode(word));
            await new Promise((res) => setTimeout(res, 40));
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // Set token bounds to prevent infinite repetition
    const maxTokens = length === "short" ? 250 : length === "long" ? 900 : 500;

    const prompt = `You are a world-class professional email copywriter. Write a clean, natural, non-repetitive email based on the following:
- Email Goal / Topic: ${topic}
- Tone of Voice: ${tone || "professional"}
- Length Limit: ${length || "medium"}
- Recipient Name: ${recipientName || "there"}
- Sender Name: ${senderName || "Best regards"}
- Additional Details: ${additionalContext || "None"}

CRITICAL RULES:
1. LANGUAGE: Detect the language of the topic/context. If Russian, write in fluent, natural Russian. If English, write in English.
2. FORMAT: Start immediately with "Subject:" (or "Тема:"), followed by a greeting, 2-3 structured paragraphs, and a polite sign-off.
3. QUALITY: NEVER repeat sentences or clauses. Keep it concise, natural, and persuasive.
4. DO NOT include markdown backticks or internal reasoning tags.`;

    // GROQ AI PROVIDER (Strictly using allam-2-7b as requested)
    if (isGroq) {
      const groq = new Groq({ apiKey: activeGroqKey });

      // Fixed model as requested: allam-2-7b (with llama-3.3-70b-versatile fallback if unavailable)
      const targetModel = "allam-2-7b";
      console.log("Using fixed Groq model:", targetModel);

      let chatCompletion;
      try {
        chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "system",
              content: "You are a professional email copywriter. Provide a concise, well-structured email without repeating text or outputting internal thought tags.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
          model: targetModel,
          temperature: 0.6,
          max_tokens: maxTokens,
          stream: true,
        });
      } catch (errPrimary: unknown) {
        console.warn("Primary model allam-2-7b failed, attempting llama-3.3-70b-versatile:", errPrimary);
        try {
          chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "system",
                content: "You are a professional email copywriter. Provide a concise, well-structured email.",
              },
              {
                role: "user",
                content: prompt,
              },
            ],
            model: "llama-3.3-70b-versatile",
            temperature: 0.6,
            max_tokens: maxTokens,
            stream: true,
          });
        } catch (groqErr: unknown) {
          const errMsg = groqErr instanceof Error ? groqErr.message : String(groqErr);
          console.error("Groq API Execution Error:", errMsg);
          return new Response(
            JSON.stringify({ error: `Groq API Error: ${errMsg}` }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      const encoder = new TextEncoder();
      let isInsideThinkBlock = false;

      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of chatCompletion) {
            let text = chunk.choices[0]?.delta?.content || "";

            // Strip out <think> ... </think> blocks if present
            if (text.includes("<think>")) {
              isInsideThinkBlock = true;
              text = text.split("<think>")[0];
            }

            if (isInsideThinkBlock) {
              if (text.includes("</think>")) {
                isInsideThinkBlock = false;
                text = text.split("</think>")[1] || "";
              } else {
                text = "";
              }
            }

            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        },
      });

      return new Response(stream, {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Transfer-Encoding": "chunked",
        },
      });
    }

    // GOOGLE GEMINI PROVIDER
    if (isGoogle) {
      try {
        const google = createGoogleGenerativeAI({ apiKey: googleKey });
        const result = await streamText({
          model: google("models/gemini-3.6-flash"),
          prompt,
          temperature: 0.6,
        });
        return result.toTextStreamResponse();
      } catch (geminiError: unknown) {
        const errMsg = geminiError instanceof Error ? geminiError.message : String(geminiError);
        console.error("Gemini API Error:", errMsg);
        return new Response(
          JSON.stringify({ error: `Gemini API Error: ${errMsg}` }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(JSON.stringify({ error: "No valid AI API key provided" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate email";
    console.error("AI Generation Route Error:", error);

    return new Response(
      JSON.stringify({ error: `Generation Error: ${message}` }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
