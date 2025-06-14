// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { getApplicationsByJobVacancyId } from "@/actions/applicationActions";
import { IApplication } from "@/models/Application";
import {
  Users,
  Mail,
  FileText,
  AlertCircle,
  ExternalLink,
  Briefcase,
} from "lucide-react";

function ApplicationSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <div className="h-4 w-[250px] bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-[200px] bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-[150px] bg-gray-200 rounded animate-pulse" />
        <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
      </div>
    </div>
  );
}

export default function JobVacancyReviewsPage() {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { id: vacancyId } = useParams();

  useEffect(() => {
    const fetchApplications = async () => {
      if (vacancyId) {
        try {
          const result = await getApplicationsByJobVacancyId(
            vacancyId as string
          );
          if (result.success && Array.isArray(result.data)) {
            setApplications(result.data);
          } else {
            setError(result.error || "Не вдалося завантажити заявки.");
          }
        } catch (err) {
          setError("Сталася невідома помилка.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplications();
  }, [vacancyId]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg max-w-lg w-full">
          <div className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            <p className="font-medium">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Briefcase className="h-8 w-8" />
            Перегляд заявок
          </h1>
        </div>

        <div className="h-[calc(100vh-200px)] overflow-y-auto pr-4 -mr-4">
          <div className="space-y-6">
            {loading ? (
              <div className="space-y-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <ApplicationSkeleton />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <ApplicationSkeleton />
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                  <ApplicationSkeleton />
                </div>
              </div>
            ) : applications.length > 0 ? (
              applications.map((application) => (
                <div
                  key={application._id}
                  className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition-shadow"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Users className="h-5 w-5 text-gray-500" />
                          <h2 className="text-xl font-semibold">
                            {application.applicant.firstName}{" "}
                            {application.applicant.lastName}
                          </h2>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <Mail className="h-4 w-4" />
                          <a
                            href={`mailto:${application.applicant.email}`}
                            className="hover:underline"
                          >
                            {application.applicant.email}
                          </a>
                        </div>
                      </div>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-sm font-medium capitalize
                          ${
                            application.status === "pending"
                              ? "bg-gray-100 text-gray-800"
                              : application.status === "accepted"
                              ? "bg-green-100 text-green-800"
                              : application.status === "rejected"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                      >
                        {application.status === "pending"
                          ? "Очікує"
                          : application.status === "accepted"
                          ? "Прийнято"
                          : application.status === "rejected"
                          ? "Відхилено"
                          : application.status}
                      </span>
                    </div>

                    {application.coverLetter && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-gray-700">
                          <FileText className="h-5 w-5" />
                          <h3 className="font-medium">Супровідний лист</h3>
                        </div>
                        <p className="text-gray-600 whitespace-pre-line pl-7">
                          {application.coverLetter}
                        </p>
                      </div>
                    )}

                    {application.resumeUrl && (
                      <div className="pl-7">
                        <a
                          href={application.resumeUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-black hover:text-gray-600 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Переглянути резюме
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-6 rounded-lg shadow text-center text-gray-500">
                <p>Заявки для цієї вакансії не знайдено.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
