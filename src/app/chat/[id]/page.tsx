import { getUserChats } from "@/actions/chatActions";
import { loadChat } from "@/tools/chat-store";
import Chat from "@/ui/chat";
import { MessageSquare, Plus } from "lucide-react";
import Link from "next/link";

export default async function Page({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { jobVacancyId?: string };
}) {
  const messages = await loadChat(params.id);
  const chats = await getUserChats();

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-muted/40 p-4 hidden md:block">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Your Chats</h2>
            <Link
              href="/chat"
              className="inline-flex items-center justify-center rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-5 w-5" />
              <span className="sr-only">New Chat</span>
            </Link>
          </div>

          <div className="space-y-2">
            {chats.map((chat) => {
              const chatId = chat._id.toString();
              const isActive = params.id === chatId;

              return (
                <Link
                  key={chatId}
                  href={`/chat/${chatId}`}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? "bg-accent text-accent-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <MessageSquare className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate text-sm">
                    {chat.title || `Chat ${chatId.slice(-6)}`}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 h-[1080px] overflow-y-auto">
          <Chat id={params.id} initialMessages={messages} />
        </div>
      </div>
    </div>
  );
}
