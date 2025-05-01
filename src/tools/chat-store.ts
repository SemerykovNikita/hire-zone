import { generateId } from "ai";
import { existsSync, mkdirSync } from "fs";
import { writeFile } from "fs/promises";
import { Message } from "ai";
import { readFile } from "fs/promises";
import path from "path";
import ChatModel from "@/models/Chat";
import { dbConnect } from "@/config/db";
import { IMessage } from "@/models/Message";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function createChat(jobVacancyId: string): Promise<string> {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const chat = new ChatModel({
    employer: session.user.id,
    jobVacancy: jobVacancyId,
    messages: [],
  });

  await chat.save();
  return chat._id.toString();
}

export async function loadChat(id: string): Promise<IMessage[]> {
  const chat = await ChatModel.findById(id).lean();

  if (!chat) {
    throw new Error(`Чат с ID ${id} не найден`);
  }

  return chat.messages;
}

export async function saveChat({
  id,
  messages,
}: {
  id: string;
  messages: IMessage[];
}): Promise<void> {
  await ChatModel.findByIdAndUpdate(
    id,
    { messages },
    { new: true, upsert: true }
  );
}
