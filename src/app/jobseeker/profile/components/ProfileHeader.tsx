"use client";

import { User, Pencil } from "lucide-react";
import Link from "next/link";
import { IUser } from "@/models/User";

interface ProfileHeaderProps {
  user: IUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 relative">
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Вітаємо, {user.firstName} {user.lastName}!
          </h1>
          <div className="flex space-x-4 text-gray-600 mt-2">
            <span>{user.email}</span>
          </div>
        </div>
      </div>

      <Link
        href="/jobseeker/edit"
        className="absolute top-6 right-6 inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
      >
        <Pencil className="w-4 h-4" />
        <span>Редагувати профіль</span>
      </Link>
    </div>
  );
}
