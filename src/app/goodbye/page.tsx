"use client";

import { Frown, Home, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function GoodbyePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
        <div className="flex justify-center mb-6">
          <Frown className="h-16 w-16 text-primary/80" />
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4">Бувай!</h1>

        <p className="text-gray-600 mb-8">
          Ваш обліковий запис було успішно видалено. Нам шкода вас втрачати і ми
          сподіваємося, що ви ще повернетеся.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-white bg-primary hover:bg-primary/90 transition-colors"
          >
            <Home className="h-4 w-4 mr-2" />
            На головну
          </Link>

          <Link
            href="/jobseeker/register"
            className="inline-flex items-center justify-center px-4 py-2 border border-primary rounded-lg text-primary hover:bg-primary/5 transition-colors"
          >
            Створити новий акаунт
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}
