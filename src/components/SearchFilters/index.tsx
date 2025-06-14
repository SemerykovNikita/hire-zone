"use client";

import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onFilter: (filters: {
    title?: string;
    city?: string;
    type?: string;
    salary?: string;
    industry?: string;
  }) => void;
  initialFilters?: {
    title?: string;
    city?: string;
  };
}

export function SearchFilters({
  onFilter,
  initialFilters,
}: SearchFiltersProps) {
  const [filters, setFilters] = useState({
    title: initialFilters?.title || "",
    city: initialFilters?.city || "",
    type: "",
    salary: "",
    industry: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Назва посади або ключове слово"
              value={filters.title}
              onChange={(e) =>
                setFilters({ ...filters, title: e.target.value })
              }
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Місто або локація"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            />
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filters.type}
              onChange={(e) => setFilters({ ...filters, type: e.target.value })}
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            >
              <option value="">Тип зайнятості</option>
              <option value="full-time">Повна зайнятість</option>
              <option value="part-time">Неповна зайнятість</option>
              <option value="contract">Контракт</option>
              <option value="internship">Стажування</option>
            </select>
          </div>

          <div className="relative">
            <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filters.salary}
              onChange={(e) =>
                setFilters({ ...filters, salary: e.target.value })
              }
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            >
              <option value="">Рівень зарплати</option>
              <option value="0-50000">$0 - $50,000</option>
              <option value="50000-100000">$50,000 - $100,000</option>
              <option value="100000-150000">$100,000 - $150,000</option>
              <option value="150000+">$150,000+</option>
            </select>
          </div>

          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <select
              value={filters.industry}
              onChange={(e) =>
                setFilters({ ...filters, industry: e.target.value })
              }
              className="pl-10 w-full rounded-lg border-gray-300 focus:border-primary focus:ring-primary"
            >
              <option value="">Сфера діяльності</option>
              <option value="it">Інформаційні технології</option>
              <option value="finance">Фінанси</option>
              <option value="education">Освіта</option>
              <option value="healthcare">Охорона здоров'я</option>
              <option value="marketing">Маркетинг</option>
              <option value="sales">Продажі</option>
              <option value="logistics">Логістика</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Знайти вакансії
          </button>
        </div>
      </form>
    </div>
  );
}
