"use server";

import { dbConnect } from "@/config/db";
import UserModel, { IUser } from "@/models/User";
import { ICreateUserResponse, IUserCreate } from "@/types/user";
import bcrypt from "bcrypt";

export async function createUser(
  data: IUserCreate
): Promise<ICreateUserResponse> {
  try {
    await dbConnect();

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new UserModel({
      ...data,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return {
      success: true,
      data: {
        id: savedUser._id.toString(),
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
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
