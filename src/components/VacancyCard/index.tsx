"use client";

import { Building2, MapPin, DollarSign, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { IJobVacancyExtended } from "@/types/job";
import { formatDate, formatSalary } from "@/utils/formatters";

interface VacancyCardProps {
  vacancy: IJobVacancyExtended;
}

export function VacancyCard({ vacancy }: VacancyCardProps) {
  const router = useRouter();
  const {
    _id,
    title,
    company,
    description,
    city,
    salaryRange,
    requirements,
    createdAt,
    postedBy,
  } = vacancy;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>

          <div className="flex items-center text-gray-600">
            <Building2 className="h-4 w-4 mr-2" />
            <span>
              {typeof company === "string" ? company : "Company Name"}
            </span>
          </div>

          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{city}</span>
          </div>

          {salaryRange && (
            <div className="flex items-center text-gray-600">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>{formatSalary(salaryRange)}</span>
            </div>
          )}
        </div>

        <span className="text-sm text-gray-500">{formatDate(createdAt)}</span>
      </div>

      <p className="mt-4 text-gray-600 line-clamp-2">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {requirements.map((req, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {req}
          </span>
        ))}
      </div>

      <button
        onClick={() => router.push(`/job/${_id}`)}
        className="mt-6 w-full flex items-center justify-center space-x-2 bg-primary text-black px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
      >
        <span>View Details</span>
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
