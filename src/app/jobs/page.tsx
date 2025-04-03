"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getJobVacanciesBySearch } from "@/actions/jobVacancyActions";
import { IGetJobVacancyResponse, IJobVacancyExtended } from "@/types/job";
import { SearchFilters } from "@/components/SearchFilters";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { VacancyCard } from "@/components/VacancyCard";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vacancies, setVacancies] = useState<IJobVacancyExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const [filters, setFilters] = useState({
    title: searchParams.get("title") || "",
    city: searchParams.get("city") || "",
    type: "",
    salary: "",
  });

  const fetchVacancies = async () => {
    setLoading(true);
    try {
      const response: IGetJobVacancyResponse = await getJobVacanciesBySearch(
        filters.title,
        filters.city,
        page,
        limit
      );

      if (response.success) {
        const vacancies = Array.isArray(response.data) ? response.data : [];
        setVacancies(vacancies);

        if (response.pagination) {
          setTotalPages(Math.ceil(response.pagination.total / limit));
        }
      } else {
        setError(response.error || "Failed to fetch job vacancies.");
      }
    } catch (err) {
      setError("An error occurred while fetching job vacancies.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVacancies();
  }, [filters, page]);

  const handleFilterChange = (newFilters: {
    title?: string;
    city?: string;
    type?: string;
    salary?: string;
  }) => {
    setFilters({
      title: newFilters.title || "",
      city: newFilters.city || "",
      type: newFilters.type || "",
      salary: newFilters.salary || "",
    });
    setPage(1);
    router.push(
      `/jobs?title=${newFilters.title || ""}&city=${newFilters.city || ""}`
    );
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage(page - 1);
  };

  const handleNextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState message={error} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Job Opportunities
          </h1>
        </div>

        <SearchFilters
          onFilter={handleFilterChange}
          initialFilters={{ title: filters.title, city: filters.city }}
        />

        {vacancies.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {vacancies.map((vacancy) => (
                <VacancyCard key={vacancy._id} vacancy={vacancy} />
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded ${
                  page === 1 ? "bg-gray-300" : "bg-blue-600 text-white"
                }`}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded ${
                  page === totalPages ? "bg-gray-300" : "bg-blue-600 text-white"
                }`}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-600">
              No vacancies found for this search.
            </p>
            <p className="mt-2 text-gray-500">
              Try adjusting your search criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
