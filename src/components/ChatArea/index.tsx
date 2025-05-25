"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Chat from "../Chat";

export default function ChatArea() {
  const params = useParams();
  const router = useRouter();
  const [chatId, setChatId] = useState<string | null>(
    params.id as string | null
  );

  useEffect(() => {
    setChatId(params.id as string | null);
  }, [params.id]);

  const handleNewChat = (newChatId: string) => {
    setChatId(newChatId);
    router.push(`/chat/${newChatId}`);
  };

  return (
    <div className="w-3/4">
      <Chat chatId={chatId} onNewChat={handleNewChat} />
    </div>
  );
}
