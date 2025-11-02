"use client";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";

export default function Page() {
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
      prepareSendMessagesRequest: ({ messages, trigger, messageId }) => {
        return {
          body: {
            messages: messages,
            trigger,
            messageId,
          },
        };
      },
    }),
  });
  const [input, setInput] = useState("");

  return (
    <div className="flex flex-col h-screen bg-[#0f0f0f]">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4 pb-32">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-2 ${
                message.role === "user" ? "justify-end" : ""
              }`}
            >
              {message.role === "assistant" && (
                <div className="w-7 h-7 rounded-md bg-[#1a1a1a] flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  🤖
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-lg px-3 py-2 ${
                  message.role === "user"
                    ? "bg-[#2f2f2f] text-white"
                    : "bg-[#1a1a1a] text-gray-200"
                }`}
              >
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return (
                        <span key={index} className="text-sm leading-relaxed">
                          {part.text}
                        </span>
                      );

                    case "dynamic-tool":
                      return (
                        <div key={index}>
                          <h4>Tool: {part.toolName}</h4>
                          {part.state}
                          {part.state === "input-streaming" && (
                            <pre>{JSON.stringify(part.input, null, 2)}</pre>
                          )}
                          {part.state === "output-available" && (
                            <pre>{JSON.stringify(part.output, null, 2)}</pre>
                          )}
                          {part.state === "output-error" && (
                            <div>Error: {part.errorText}</div>
                          )}
                        </div>
                      );
                  }
                })}
              </div>
              {message.role === "user" && (
                <div className="w-7 h-7 rounded-md bg-blue-600 flex items-center justify-center text-xs flex-shrink-0 mt-0.5">
                  👤
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-[#0f0f0f] border-t border-[#2f2f2f] p-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (input.trim()) {
              sendMessage({ text: input });
              setInput("");
            }
          }}
          className="max-w-3xl mx-auto flex gap-2"
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={status !== "ready"}
            placeholder="Message..."
            className="flex-1 bg-[#1a1a1a] text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-gray-600 disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={status !== "ready"}
            className="px-5 py-2.5 bg-white text-black font-medium rounded-lg text-sm hover:bg-gray-200 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
