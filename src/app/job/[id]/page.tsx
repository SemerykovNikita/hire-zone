"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getJobVacancyById } from "@/actions/jobVacancyActions";
import { addFavorite, removeFavorite } from "@/actions/favoriteActions";
import { Building2, MapPin, DollarSign, ListChecks } from "lucide-react";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";
import { CompanyInfo } from "./components/CompanyInfo";
import { JobActions } from "./components/JobActions";
import { formatSalary } from "@/utils/formatters";

export default function JobVacancyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [jobVacancy, setJobVacancy] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchJobVacancy = async () => {
      try {
        const result = await getJobVacancyById(params.id);
        if (result.success && result.data) {
          setJobVacancy(result.data);
        } else {
          setError(result.error || "Failed to fetch job vacancy details.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobVacancy();
  }, [params.id]);

  const handleApplyClick = () => {
    router.push(`/jobseeker/apply/${params.id}`);
  };

  const handleFavoriteToggle = async () => {
    if (!session?.user) {
      alert("Please log in to manage favorites.");
      return;
    }

    try {
      if (isFavorite) {
        const result = await removeFavorite(params.id);
        if (result.success) {
          setIsFavorite(false);
        } else {
          throw new Error(result.error);
        }
      } else {
        const result = await addFavorite(params.id);
        if (result.success) {
          setIsFavorite(true);
        } else {
          throw new Error(result.error);
        }
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update favorites");
    }
  };

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!jobVacancy) return <ErrorState message="No job vacancy found." />;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content - Left Side */}
          <div className="flex-1 space-y-6">
            {/* Job Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                  {jobVacancy.title}
                </h1>
                <JobActions
                  onApply={handleApplyClick}
                  onFavoriteToggle={handleFavoriteToggle}
                  isFavorite={isFavorite}
                  isLoggedIn={!!session?.user}
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-600">
                  <MapPin className="h-5 w-5" />
                  <span>{jobVacancy.city}</span>
                </div>

                {jobVacancy.salaryRange && (
                  <div className="flex items-center space-x-3 text-gray-600">
                    <DollarSign className="h-5 w-5" />
                    <span>{formatSalary(jobVacancy.salaryRange)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">Job Description</h2>
              <p className="text-gray-600 whitespace-pre-wrap">
                {jobVacancy.description}
              </p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-2 mb-4">
                <ListChecks className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-semibold">Requirements</h2>
              </div>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                {jobVacancy.requirements.map((req: string, index: number) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Company Information - Right Side */}
          <div className="lg:w-80 flex-shrink-0">
            <div className="sticky top-6">
              <CompanyInfo company={jobVacancy.company} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
