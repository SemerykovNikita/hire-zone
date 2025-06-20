import type { Metadata } from "next";
import localFont from "next/font/local";
import SessionProvider from "@/components/SessionProvider";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="flex flex-col flex-grow overflow-hidden">{children}</main>
  );
}
