import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { generateMockEmailContent } from "@/lib/ai/mock-stream";

export async function POST(req: Request) {
  try {
    const { topic, tone, length, recipientName, senderName, additionalContext, useMockMode } =
      await req.json();

    if (!topic) {
      return new Response(JSON.stringify({ error: "Topic is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY?.trim() || "";

    // If mock mode requested OR no Gemini API key set, return readable text stream mock
    if (useMockMode || !apiKey || apiKey === "your_gemini_api_key_here") {
      const mockContent = generateMockEmailContent({
        topic,
        tone: tone || "professional",
        length: length || "medium",
        recipientName,
        senderName,
        additionalContext,
      });

      // Create a readable stream simulating typing
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

    // Real Google Gemini AI Streaming via Vercel AI SDK
    const google = createGoogleGenerativeAI({ apiKey });

    const prompt = `You are an elite executive copywriter. Write a highly compelling email based on the following parameters:
- Topic / Goal: ${topic}
- Desired Tone: ${tone}
- Desired Length: ${length} (Short = 2-3 sentences, Medium = 2-3 short paragraphs, Long = comprehensive detailed structure)
- Recipient Name: ${recipientName || "there"}
- Sender Name: ${senderName || "Alex"}
- Additional Context / Instructions: ${additionalContext || "None"}

Requirements:
1. Always start with a relevant, catchy "Subject: ..." line.
2. Structure with clean line breaks between paragraphs.
3. Match the chosen tone (${tone}) accurately throughout.
4. Do not include markdown code block ticks.`;

    const result = await streamText({
      model: google("gemini-1.5-flash"),
      prompt,
      temperature: 0.7,
    });

    return result.toDataStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to generate email";
    console.error("AI Generation Error:", error);

    // If the error is a Gemini API key issue, return mock response as fallback
    if (message.includes("API key") || message.includes("401") || message.includes("403")) {
      try {
        const body = await new Response(
          (await req.clone()).body
        ).json();

        const mockContent = generateMockEmailContent({
          topic: body.topic || "General Email",
          tone: body.tone || "professional",
          length: body.length || "medium",
          recipientName: body.recipientName,
          senderName: body.senderName,
          additionalContext: body.additionalContext,
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
      } catch {
        // If fallback also fails, return error
      }
    }

    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
