import { config } from "@/app/lib/config";
import { UIMessage, streamText, convertToModelMessages, stepCountIs } from "ai";
import { experimental_createMCPClient } from "@ai-sdk/mcp";
import { createOpenRouter } from "@openrouter/ai-sdk-provider";
 const openrouter = createOpenRouter({
    apiKey: config.MODEL_API_KEY,
  });

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(request: Request) {
  const { messages }: { messages: UIMessage[] } = await request.json();
    const refoldMCPClient = await experimental_createMCPClient({
      transport: {
        type: "http",
        url: config.MCP_URL,
      },
    });
    const tools = await refoldMCPClient.tools();

    const result = streamText({
        stopWhen: stepCountIs(50),
      model: openrouter.chat(config.MODEL_NAME),
      onFinish: async ()=>{
        if (refoldMCPClient) {
            await refoldMCPClient.close();
          }
      },
      tools,
      system: "You are a helpful assistant by Refold AI. use the Tools Provided to you to answer the user's question.",
      messages: convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  
}
