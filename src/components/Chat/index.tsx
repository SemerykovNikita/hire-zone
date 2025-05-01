"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useState } from "react";

interface ChatProps {
  chatId: string | null;
  onNewChat: (newChatId: string) => void;
}

export default function Chat({ chatId, onNewChat }: ChatProps) {
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    id: chatId || undefined,
    initialMessages: [],
    api: "/api/chat",
    onFinish: (message) => {
      if (!chatId) {
        // Извлекаем chatId из первого чанка ответа
        const chatIdMatch = message.content.match(/"chatId":"([^"]+)"/);
        if (chatIdMatch && chatIdMatch[1]) {
          onNewChat(chatIdMatch[1]);
        }
      }
    },
  });
  const [savedMessages, setSavedMessages] = useState([]);

  useEffect(() => {
    if (chatId) {
      fetchSavedMessages();
    } else {
      setSavedMessages([]);
    }
  }, [chatId]);

  async function fetchSavedMessages() {
    const response = await fetch(`/api/messages?chatId=${chatId}`);
    const data = await response.json();
    setSavedMessages(data);
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleSubmit(e);
  };

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {savedMessages.map((m: any, index: number) => (
          <div key={index} className="whitespace-pre-wrap">
            <strong>{m.role}: </strong>
            {m.content}
          </div>
        ))}
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <strong>{m.role}: </strong>
            {m.content.replace(/"chatId":"[^"]+"/, "")}{" "}
            {/* Удаляем chatId из отображения */}
          </div>
        ))}
      </div>
      <form onSubmit={handleFormSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
