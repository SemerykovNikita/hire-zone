// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserCompany, deleteCompany } from "@/actions/companyActions";
import {
  getJobVacanciesByCompanyId,
  toggleJobVacancyStatus,
  deleteJobVacancy,
} from "@/actions/jobVacancyActions";
import { IJobVacancy } from "@/types/job";
import {
  Building2,
  Briefcase,
  AlertCircle,
  Loader2,
  Trash2,
  Eye,
  ToggleLeft,
  ToggleRight,
  Plus,
  DollarSign,
  Edit2,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";

export default function EmployerDashboard() {
  const [vacancies, setVacancies] = useState<IJobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(
    null
  );
  const [showCompanyDeleteConfirm, setShowCompanyDeleteConfirm] =
    useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyAndVacancies = async () => {
      try {
        const companyResponse = await getUserCompany();
        if (!companyResponse.success || !companyResponse.data) {
          router.push("/employer/create-company");
          return;
        }

        const companyId = companyResponse.data._id.toString();
        setCompanyId(companyId);

        const jobVacanciesResponse = await getJobVacanciesByCompanyId(
          companyId
        );

        if (
          jobVacanciesResponse.success &&
          Array.isArray(jobVacanciesResponse.data)
        ) {
          setVacancies(jobVacanciesResponse.data);
        } else {
          setError("Не знайдено жодної вакансії для цієї компанії.");
        }
      } catch (err) {
        setError("Сталася помилка під час завантаження даних.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCompanyAndVacancies();
    }
  }, [session, router]);

  const handleToggleStatus = async (vacancyId: string) => {
    const result = await toggleJobVacancyStatus(vacancyId);
    if (result.success) {
      setVacancies((prev) =>
        prev.map((vacancy) =>
          vacancy._id === vacancyId
            ? { ...vacancy, isActive: !vacancy.isActive }
            : vacancy
        )
      );
    }
  };

  const handleDeleteVacancy = async (vacancyId: string) => {
    const result = await deleteJobVacancy(vacancyId);
    if (result.success) {
      setVacancies((prev) =>
        prev.filter((vacancy) => vacancy._id !== vacancyId)
      );
      setShowDeleteConfirm(null);
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyId) return;

    const result = await deleteCompany(companyId);
    if (result.success) {
      router.push("/employer/create-company");
    }
    setShowCompanyDeleteConfirm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Вакансії</h1>
            <p className="mt-2 text-gray-600">
              Керуйте вакансіями вашої компанії
            </p>
          </div>
          <div className="flex space-x-4">
            <Link
              href="/employer/post-job"
              className="flex items-center px-4 py-2 border border-black text-black rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Створити вакансію
            </Link>
            <Link
              href="/employer/update-company"
              className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
            >
              <Edit2 className="h-4 w-4 mr-2" />
              Редагувати компанію
            </Link>
            <button
              onClick={() => setShowCompanyDeleteConfirm(true)}
              className="flex items-center px-4 py-2 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Видалити компанію
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {vacancies.length > 0 ? (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Деталі
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Вимоги
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Зарплата
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Статус
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Дії
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {vacancies.map((vacancy) => (
                    <tr key={vacancy._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-start space-x-3">
                          <Briefcase className="h-5 w-5 text-gray-400 mt-1" />
                          <div>
                            <div className="font-medium text-gray-900">
                              {vacancy.title}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {vacancy.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {vacancy.requirements.map((req, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {req}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          {vacancy.salaryRange?.min.toLocaleString()} –{" "}
                          {vacancy.salaryRange?.max.toLocaleString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            vacancy.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {vacancy.isActive ? "Активна" : "Неактивна"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right space-x-3">
                        <button
                          onClick={() => handleToggleStatus(vacancy._id)}
                          title={
                            vacancy.isActive ? "Деактивувати" : "Активувати"
                          }
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          {vacancy.isActive ? (
                            <ToggleRight className="h-5 w-5" />
                          ) : (
                            <ToggleLeft className="h-5 w-5" />
                          )}
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/employer/update-vacancy/${vacancy._id}`
                            )
                          }
                          title="Редагувати вакансію"
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Edit2 className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(
                              `/employer/job-vacancies/${vacancy._id}/reviews`
                            )
                          }
                          title="Переглянути відгуки"
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/chat?jobVacancyId=${vacancy._id}`)
                          }
                          title="Відкрити чат"
                          className="text-gray-400 hover:text-primary transition-colors"
                        >
                          <MessageCircle className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(vacancy._id)}
                          title="Видалити"
                          className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-sm">
            <Briefcase className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              Вакансії відсутні
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Створіть першу вакансію, щоб розпочати.
            </p>
            <div className="mt-6">
              <Link
                href="/employer/post-job"
                className="inline-flex items-center px-4 py-2 border border-black text-black rounded-md hover:bg-gray-100 transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                Створити вакансію
              </Link>
            </div>
          </div>
        )}

        {/* Підтвердження видалення вакансії */}
        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Видалити вакансію
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Ви впевнені, що хочете видалити цю вакансію? Цю дію не можна
                скасувати.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Скасувати
                </button>
                <button
                  onClick={() => handleDeleteVacancy(showDeleteConfirm)}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md"
                >
                  Видалити
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Підтвердження видалення компанії */}
        {showCompanyDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Building2 className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-medium text-gray-900">
                  Видалити компанію
                </h3>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                Ви дійсно хочете видалити компанію? Всі вакансії та дані будуть
                остаточно втрачені. Цю дію не можна скасувати.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowCompanyDeleteConfirm(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                >
                  Скасувати
                </button>
                <button
                  onClick={handleDeleteCompany}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Видалити компанію
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
