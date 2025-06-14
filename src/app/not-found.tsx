"use client";

import { ArrowLeft, Home } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        <div className="bg-white border border-gray-200 rounded-2xl p-10 md:p-14 shadow-md text-center space-y-10 relative overflow-hidden">
          <div className="relative">
            <h1 className="text-[9rem] md:text-[12rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-black/20 via-black/10 to-black/20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl md:text-3xl font-semibold text-black">
                Сторінку не знайдено
              </span>
            </div>
          </div>

          <div className="space-y-3 max-w-lg mx-auto">
            <p className="text-gray-600">
              Сторінка, яку ви шукаєте, не існує або була переміщена. Перевірте
              URL-адресу або скористайтеся однією з кнопок нижче.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border-2 border-black rounded-xl font-medium text-black hover:bg-black hover:text-white transition-all gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>

            <button
              onClick={() => (window.location.href = "/")}
              className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 bg-black rounded-xl font-medium text-white hover:bg-gray-800 transition-all gap-2"
            >
              <Home className="w-5 h-5" />
              На головну
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
