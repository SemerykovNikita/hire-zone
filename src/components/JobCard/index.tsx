"use client";

import { Building2, MapPin, DollarSign, Clock } from "lucide-react";
import Link from "next/link";

interface JobCardProps {
  job: {
    _id: string;
    title: string;
    company?: string;
    description: string;
    city: string;
    salaryRange?: {
      min: number;
      max: number;
    };
    requirements: string[];
    postedAt?: string;
  };
}

export function JobCard({ job }: JobCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.title}
          </h3>
          <div className="flex items-center text-gray-600 mb-2">
            <Building2 className="h-4 w-4 mr-2" />
            <span>{job.company || "Company Name"}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{job.city}</span>
          </div>
          {job.salaryRange && (
            <div className="flex items-center text-gray-600 mb-2">
              <DollarSign className="h-4 w-4 mr-2" />
              <span>
                ${job.salaryRange.min.toLocaleString()} - $
                {job.salaryRange.max.toLocaleString()} / year
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center text-gray-500">
          <Clock className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {job.postedAt
              ? new Date(job.postedAt).toLocaleDateString()
              : "Recently"}
          </span>
        </div>
      </div>

      <p className="text-gray-600 mt-4 line-clamp-2">{job.description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.requirements.slice(0, 3).map((req, index) => (
          <span
            key={index}
            className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm"
          >
            {req}
          </span>
        ))}
        {job.requirements.length > 3 && (
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">
            +{job.requirements.length - 3} more
          </span>
        )}
      </div>

      <div className="mt-6 flex justify-end">
        <Link
          href={`/job/${job._id}`}
          className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
