import { dbConnect } from "@/config/db";
import Chat from "@/models/Chat";
import Link from "next/link";

export default async function ChatList() {
  await dbConnect();
  const chats = await Chat.find().sort({ createdAt: -1 });

  return (
    <div className="w-1/4 pr-4">
      <Link
        href="/"
        className="block w-full p-2 mb-2 bg-blue-500 text-white rounded text-center"
      >
        Новий чат
      </Link>
      {chats.map((chat: any) => (
        <Link
          key={chat._id}
          href={`/chat/${chat._id}`}
          className="block p-2 mb-2 hover:bg-gray-100 rounded"
        >
          {chat.title || "Без назви"}
        </Link>
      ))}
    </div>
  );
}
