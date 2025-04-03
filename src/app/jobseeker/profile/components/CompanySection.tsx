"use client";

import { Building2, Users } from "lucide-react";
import { ICompany } from "@/models/Company";
import { IApplication } from "@/models/Application";
import { ApplicationList } from "./ApplicationList";

interface CompanySectionProps {
  company: ICompany;
  applications: IApplication[];
}

export function CompanySection({ company, applications }: CompanySectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Company Information</h2>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{company.name}</h3>
          <p className="text-gray-600">{company.description}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center space-x-3 mb-6">
          <Users className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Job Applications</h2>
        </div>
        <ApplicationList applications={applications} isEmployer={true} />
      </div>
    </div>
  );
}
