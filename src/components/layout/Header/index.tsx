"use client";

import Link from "next/link";
import { Briefcase, Heart, LayoutDashboard, Shield } from "lucide-react";
import { useSession, signOut } from "next-auth/react";

interface NavItem {
  label: string;
  href: string;
  roles: string[];
}

export default function Header() {
  const { data: session } = useSession();
  const role = session?.user?.role || "guest";

  const navItems: NavItem[] = [
    {
      label: "Знайти роботу",
      href: "/jobs",
      roles: ["admin", "employer", "job_seeker", "guest"],
    },
    {
      label: "Компанії",
      href: "/companies",
      roles: ["admin", "employer", "job_seeker", "guest"],
    },
    {
      label: "Опублікувати вакансію",
      href: "/employer/post-job",
      roles: ["employer"],
    },
  ];

  const filteredNav = navItems.filter((item) => item.roles.includes(role));

  const profileLink =
    role === "employer"
      ? "/employer/dashboard"
      : role === "admin"
      ? "/admin"
      : "/jobseeker/profile";

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Briefcase className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">HireZone</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {filteredNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-gray-600 hover:text-primary transition-colors"
              >
                {item.label}
              </Link>
            ))}

            {role === "admin" && (
              <Link
                href="/admin"
                className="text-gray-600 hover:text-primary transition-colors flex items-center space-x-1"
              >
                <Shield className="w-4 h-4" />
                <span>Панель адміністратора</span>
              </Link>
            )}

            {role === "employer" && (
              <Link
                href="/employer/dashboard"
                className="text-gray-600 hover:text-primary transition-colors flex items-center space-x-1"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Кабінет</span>
              </Link>
            )}
          </nav>

          <div className="flex items-center space-x-4">
            <Link
              href="/favorites"
              className="text-gray-600 hover:text-primary transition-colors"
              title="Обране"
            >
              <Heart className="w-5 h-5" />
            </Link>

            {session ? (
              <>
                <Link
                  href={profileLink}
                  className="text-gray-700 hover:text-primary transition-colors"
                >
                  Вітаємо, {session.user.firstName}!
                </Link>
                <button
                  onClick={() => signOut()}
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Вийти
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/jobseeker/signin"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Увійти
                </Link>
                <Link
                  href="/jobseeker/signup"
                  className="text-gray-600 hover:text-primary transition-colors"
                >
                  Зареєструватися
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
