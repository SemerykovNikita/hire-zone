"use client";

import { Message, useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useSearchParams } from "next/navigation";
import { Send } from "lucide-react";
import { useRef, useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import { getJobVacancyById } from "@/actions/jobVacancyActions";

export const dynamic = "force-dynamic";

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
          console.error("Не вдалося отримати назву вакансії:", error);
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

  // useEffect(() => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  // }, [messages]);

  return (
    <div className="flex flex-col flex-1 bg-white h-full overflow-hidden">
      {/* Заголовок чату */}
      <div className="border-b border-gray-200 p-4">
        <h1 className="text-xl font-semibold text-gray-800">
          Аналіз вакансії: {vacancyTitle || "Завантаження..."}
        </h1>
      </div>

      {/* Контейнер повідомлень */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 space-y-6">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-500">
              <h3 className="text-xl font-medium mb-2">Почніть розмову</h3>
              <p>Запитайте про резюме кандидатів для цієї вакансії</p>
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

      {/* Область вводу */}
      <div className="sticky bottom-0 w-full border-t border-gray-200 p-4 bg-white">
        <form
          onSubmit={handleSubmit}
          className="flex items-center space-x-2 bg-white rounded-lg border border-gray-300 focus-within:border-gray-500 focus-within:ring-1 focus-within:ring-gray-500 transition-all"
        >
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Введіть повідомлення..."
            className="flex-1 px-4 py-3 bg-transparent outline-none text-gray-800"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="p-2 text-gray-500 hover:text-gray-800 disabled:opacity-50 transition-colors"
            disabled={isLoading || !input.trim()}
          >
            <Send size={20} />
            <span className="sr-only">Надіслати</span>
          </button>
        </form>
      </div>
    </div>
  );
}
