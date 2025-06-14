// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, Briefcase } from "lucide-react";
import { getPopularCategories } from "@/actions/categoryActions";

export default function SearchPage() {
  const [title, setTitle] = useState("");
  const [city, setCity] = useState("");
  const [featuredCategories, setFeaturedCategories] = useState<
    { name: string; count: string }[] | undefined
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await getPopularCategories();
      if (response.success) {
        setFeaturedCategories(
          response.data.map((category: any) => ({
            name: category.name,
            count: `${category.vacancyCount} вакансій`,
          }))
        );
      } else {
        console.error(
          "Не вдалося завантажити популярні категорії:",
          response.error
        );
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title && !city) {
      router.push("/jobs");
    } else {
      const query = new URLSearchParams();
      if (title) query.set("title", title);
      if (city) query.set("city", city);
      router.push(`/jobs?${query.toString()}`);
    }
  };

  return (
    <main className="min-h-screen">
      <div className="relative bg-gradient-to-r from-primary to-primary/90 text-white">
        <div className="absolute inset-0 bg-black" />
        <div className="relative max-w-7xl mx-auto px-4 py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Знайдіть роботу своєї мрії вже сьогодні
            </h1>
            <p className="mt-6 max-w-2xl mx-auto text-xl text-gray-200">
              Перегляньте тисячі вакансій від провідних компаній та зробіть
              наступний крок у своїй карʼєрі.
            </p>
          </div>

          {/* Пошукова форма */}
          <div className="mt-12 max-w-3xl mx-auto">
            <form
              onSubmit={handleSearch}
              className="flex flex-col md:flex-row gap-4"
            >
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Посада або компанія"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 h-[calc(3rem+2px)] rounded-lg border-0 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-2 focus:ring-primary"
                />
              </div>
              {/* TODO: Отримання міст із бази даних */}
              <div className="flex-1 relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 h-[calc(3rem+2px)] rounded-lg border-0 ring-1 ring-inset ring-gray-300 text-gray-900 focus:ring-2 focus:ring-primary"
                >
                  <option value="">Оберіть місто</option>
                  <option value="Kyiv">Київ</option>
                  <option value="Lviv">Львів</option>
                  <option value="Odessa">Одеса</option>
                  <option value="Zhytomyr">Житомир</option>
                </select>
              </div>
              <button
                type="submit"
                className="bg-white text-black hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg duration-200"
              >
                Знайти вакансії
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-center mb-12">
          Популярні категорії
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredCategories.map((category, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-6 rounded-lg border border-gray-200 hover:border-primary hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="p-3 bg-primary/10 rounded-lg text-primary">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{category.name}</h3>
                <p className="text-gray-600">{category.count}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary">15k+</div>
              <div className="mt-2 text-gray-600">Активних вакансій</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">8k+</div>
              <div className="mt-2 text-gray-600">Компаній</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">25k+</div>
              <div className="mt-2 text-gray-600">Пошукачів</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary">12k+</div>
              <div className="mt-2 text-gray-600">Успішних наймів</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
