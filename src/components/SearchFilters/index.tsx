"use client";

import { Search, MapPin, Briefcase, DollarSign } from "lucide-react";
import { useState } from "react";

interface SearchFiltersProps {
  onFilter: (filters: {
    title?: string;
    city?: string;
    type?: string;
    salary?: string;
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
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter(filters);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Job title or keyword"
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
              placeholder="City or location"
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
              <option value="">Job Type</option>
              <option value="full-time">Full Time</option>
              <option value="part-time">Part Time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
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
              <option value="">Salary Range</option>
              <option value="0-50000">$0 - $50,000</option>
              <option value="50000-100000">$50,000 - $100,000</option>
              <option value="100000-150000">$100,000 - $150,000</option>
              <option value="150000+">$150,000+</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Search Jobs
          </button>
        </div>
      </form>
    </div>
  );
}
