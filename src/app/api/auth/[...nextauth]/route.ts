import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { dbConnect } from "@/config/db";
import UserModel from "@/models/User";
import bcrypt from "bcrypt";
import { authOptions } from "./authOptions";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
