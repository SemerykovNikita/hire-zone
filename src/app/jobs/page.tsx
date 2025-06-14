"use client";

export const dynamic = "force-dynamic";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { getJobVacanciesBySearch } from "@/actions/jobVacancyActions";
import { IGetJobVacancyResponse, IJobVacancyExtended } from "@/types/job";
import { SearchFilters } from "@/components/SearchFilters";
import { ErrorState } from "@/components/ErrorState";
import { LoadingState } from "@/components/LoadingState";
import { VacancyCard } from "@/components/VacancyCard";
import { useCompletion } from "ai/react";
import Toast from "@/components/Toast";
import ReactMarkdown from "react-markdown";

const PageContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [vacancies, setVacancies] = useState<IJobVacancyExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentVacancyId, setCurrentVacancyId] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "info" | "error" | "success";
  } | null>(null);

  const limit = 10;

  const { completion, complete, isLoading } = useCompletion({
    api: "/api/completion",
    onError(err) {
      setToast({
        message: "Помилка під час генерації пропозиції",
        type: "error",
      });
      setIsModalOpen(false);
    },
    onFinish() {
      setToast({
        message: "Пропозиція успішно згенерована",
        type: "success",
      });
    },
  });

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
        setError(response.error || "Не вдалося завантажити вакансії.");
      }
    } catch (err) {
      setError("Сталася помилка під час завантаження вакансій.");
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

  const handleOpenModal = async (vacancyId: string) => {
    setCurrentVacancyId(vacancyId);
    setIsModalOpen(true);
    await complete(vacancyId);
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
            Пропозиції роботи
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
                <VacancyCard
                  key={vacancy._id}
                  vacancy={vacancy}
                  onAIRequest={handleOpenModal}
                />
              ))}
            </div>
            <div className="flex justify-center mt-8 space-x-4">
              <button
                onClick={handlePreviousPage}
                disabled={page === 1}
                className={`px-4 py-2 rounded ${
                  page === 1 ? "bg-gray-300" : "bg-black text-white"
                }`}
              >
                Попередня
              </button>
              <button
                onClick={handleNextPage}
                disabled={page === totalPages}
                className={`px-4 py-2 rounded ${
                  page === totalPages ? "bg-gray-300" : "bg-black text-white"
                }`}
              >
                Наступна
              </button>
            </div>
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <p className="text-xl text-gray-600">
              За заданими критеріями вакансій не знайдено.
            </p>
            <p className="mt-2 text-gray-500">
              Спробуйте змінити параметри пошуку.
            </p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto text-black">
            <h2 className="text-xl font-semibold mb-4">Пропозиція від AI</h2>
            {isLoading ? (
              <p className="text-black">Генерація...</p>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                <div className="prose max-w-none prose-black">
                  <ReactMarkdown>{completion}</ReactMarkdown>
                </div>
              </div>
            )}
            <div className="mt-6 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 border border-black text-black rounded-full hover:bg-black hover:text-white transition"
              >
                Закрити
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default function JobsPage() {
  return (
    <Suspense fallback={<div>Завантаження...</div>}>
      <PageContent />
    </Suspense>
  );
}
