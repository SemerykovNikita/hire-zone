"use client";

import { User } from "lucide-react";
import { IUser } from "@/models/User";

interface ProfileHeaderProps {
  user: IUser;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-4">
        <div className="bg-primary/10 p-4 rounded-full">
          <User className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome, {user.firstName} {user.lastName}!
          </h1>
          <div className="flex space-x-4 text-gray-600 mt-2">
            <span>{user.email}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
