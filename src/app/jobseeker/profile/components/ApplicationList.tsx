// @ts-nocheck

"use client";

import { IApplication } from "@/models/Application";
import { Briefcase, Calendar } from "lucide-react";

interface ApplicationListProps {
  applications: IApplication[];
  isEmployer?: boolean;
}

export function ApplicationList({
  applications,
  isEmployer,
}: ApplicationListProps) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 rounded-lg">
        <p className="text-gray-600">
          {isEmployer
            ? "No applications found for your company."
            : "You have not applied for any jobs yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {applications.map((application) => (
        <div
          key={application._id}
          className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex items-start space-x-3">
            <Briefcase className="h-5 w-5 text-primary mt-1" />
            <div>
              <h3 className="font-medium">{application.jobVacancy.title}</h3>
              {isEmployer && (
                <p className="text-sm text-gray-600">
                  {application.applicant.firstName}{" "}
                  {application.applicant.lastName}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center mt-2 sm:mt-0">
            <Calendar className="h-4 w-4 text-gray-400 mr-2" />
            <span className="text-sm text-gray-600">
              {new Date(application.createdAt).toLocaleDateString()}
            </span>
            <span
              className={`ml-4 px-3 py-1 rounded-full text-sm ${
                application.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : application.status === "accepted"
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {application.status.charAt(0).toUpperCase() +
                application.status.slice(1)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
