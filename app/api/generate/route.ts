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

    const prompt = `You are an elite, highly professional AI copywriter and email assistant. Write a high-converting, realistic email based on the following parameters:
- Topic / Goal: ${topic}
- Desired Tone: ${tone || "professional"}
- Desired Length: ${length || "medium"} (Short = 2-3 concise sentences, Medium = 2-3 short structured paragraphs, Long = detailed comprehensive email)
- Recipient Name: ${recipientName || ""}
- Sender Name: ${senderName || ""}
- Additional Context / Instructions: ${additionalContext || "None"}

CRITICAL INSTRUCTIONS:
1. DETECT THE LANGUAGE OF THE INPUT TOPIC AND CONTEXT. IF WRITTEN IN RUSSIAN, WRITE THE ENTIRE EMAIL IN NATURAL, ELEGANT RUSSIAN. IF WRITTEN IN ENGLISH, WRITE IN ENGLISH.
2. Always start with a catchy, relevant subject line ("Subject: ..." or "Тема: ...").
3. Use proper paragraph line breaks and professional formatting.
4. Match the requested tone (${tone}) accurately throughout.
5. Do not include markdown code block ticks (\`\`\`).`;

    // REAL AI GENERATION (No silent mock interception)
    if (isGroq) {
      const groq = new Groq({ apiKey: activeGroqKey });

      let chatCompletion;
      try {
        chatCompletion = await groq.chat.completions.create({
          messages: [
            {
              role: "user",
              content: prompt,
            },
          ],
          model: "llama-3.3-70b-versatile",
          temperature: 0.7,
          stream: true,
        });
      } catch (err1: unknown) {
        console.warn("Groq llama-3.3-70b-versatile failed, trying llama-3.1-8b-instant:", err1);
        try {
          chatCompletion = await groq.chat.completions.create({
            messages: [
              {
                role: "user",
                content: prompt,
              },
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            stream: true,
          });
        } catch (err2: unknown) {
          const errMsg = err2 instanceof Error ? err2.message : String(err2);
          console.error("Groq API Error:", errMsg);
          return new Response(
            JSON.stringify({ error: `Groq API Error: ${errMsg}` }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }
      }

      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        async start(controller) {
          for await (const chunk of chatCompletion) {
            const text = chunk.choices[0]?.delta?.content || "";
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

    // Google Gemini Streaming
    if (isGoogle) {
      try {
        const google = createGoogleGenerativeAI({ apiKey: googleKey });
        const result = await streamText({
          model: google("models/gemini-3.6-flash"),
          prompt,
          temperature: 0.7,
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
