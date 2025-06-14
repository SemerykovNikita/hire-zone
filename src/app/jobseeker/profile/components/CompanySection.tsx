"use client";

import { Building2, Users, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { ICompany } from "@/models/Company";

interface CompanySectionProps {
  company: ICompany;
}

export function CompanySection({ company }: CompanySectionProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6 relative">
        <div className="flex items-center space-x-3 mb-4">
          <Building2 className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold">Інформація про компанію</h2>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{company.name}</h3>
          <p className="text-gray-600">{company.description}</p>
        </div>

        <Link
          href="/employer/dashboard"
          className="absolute top-6 right-6 inline-flex items-center space-x-2 px-4 py-2 bg-black text-white text-sm rounded-lg hover:bg-gray-800 transition"
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Перейти в кабінет</span>
        </Link>
      </div>
    </div>
  );
}
