"use client";

import { Message, useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getJobVacancyById } from "@/actions/jobVacancyActions";

export default function Chat({
  id,
  initialMessages,
}: { id?: string; initialMessages?: Message[] } = {}) {
  const searchParams = useSearchParams();
  const jobVacancyId = searchParams.get("jobVacancyId");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [vacancyTitle, setVacancyTitle] = useState<string>("");

  useEffect(() => {
    const fetchVacancyTitle = async () => {
      if (jobVacancyId) {
        try {
          const result = await getJobVacancyById(jobVacancyId);
          if (result.success && result.data) {
            setVacancyTitle(result.data.title);
          }
        } catch (error) {
          console.error("Failed to fetch vacancy title:", error);
        }
      }
    };

    fetchVacancyTitle();
  }, [jobVacancyId]);

  const { input, handleInputChange, handleSubmit, messages, isLoading } =
    useChat({
      id,
      initialMessages,
      sendExtraMessageFields: true,
      generateId: createIdGenerator({ prefix: "msgc", size: 16 }),
      body: { jobVacancyId },
    });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 bg-white h-full max-h-screen">
      {/* Chat header */}
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Job Vacancy Analysis: {vacancyTitle || "Loading..."}
        </h1>
      </div>

      {/* Messages container */}
      <div className="flex-1 overflow-y-auto p-4 pb-20 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h3 className="text-xl font-medium mb-2">Start a conversation</h3>
              <p>Ask about candidate resumes for this job vacancy</p>
            </div>
          </div>
        ) : (
          messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-3 ${
                  m.role === "user"
                    ? "bg-black text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {m.role === "user" ? (
                  <div className="whitespace-pre-wrap">{m.content}</div>
                ) : (
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    <ReactMarkdown>{m.content}</ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="sticky bottom-0 w-full border-t border-gray-200 p-4 bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 transition-all"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
            disabled={isLoading || !input.trim()}
          >
            <Send size={20} />
            <span className="sr-only">Send</span>
          </button>
        </form>
      </div>
    </div>
  );
}
