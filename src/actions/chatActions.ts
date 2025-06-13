"use server";
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";
import { dbConnect } from "@/config/db";
import ChatModel from "@/models/Chat";
import JobVacancyModel from "@/models/JobVacancy";
import { getServerSession } from "next-auth";

export async function getUserChats() {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const chats = await ChatModel.find({
    employer: session.user.id,
  }).lean();

  return chats;
}

export async function getChatById(id: string) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const chat = await ChatModel.findById(id).lean();
  if (!chat) {
    throw new Error("Chat not found");
  }
  return chat;
}
