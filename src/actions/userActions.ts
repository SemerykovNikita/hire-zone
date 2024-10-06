"use server";

import { dbConnect } from "@/config/db";
import UserModel, { IUser } from "@/models/User";

export async function createUser(data: IUser) {
  await dbConnect();
  const newUser = new UserModel(data);
  return await newUser.save();
}

export async function getUserById(userId: string) {
  await dbConnect();
  return await UserModel.findById(userId);
}

export async function updateUser(userId: string, data: Partial<IUser>) {
  await dbConnect();
  return await UserModel.findByIdAndUpdate(userId, data, { new: true });
}

export async function deleteUser(userId: string) {
  await dbConnect();
  return await UserModel.findByIdAndDelete(userId);
}
