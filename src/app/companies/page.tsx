"use client";

import { useEffect, useState } from "react";
import { AlertCircle, Building2, ExternalLink, Loader2 } from "lucide-react";
import { ICompany } from "@/models/Company";
import { getAllCompanies } from "@/actions/companyActions";
import Link from "next/link";

export default function AllCompaniesPage() {
  const [companies, setCompanies] = useState<ICompany[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      const result = await getAllCompanies();
      if (result.success && result.data) {
        setCompanies(result.data);
      } else {
        setError(result.error || "Failed to fetch companies.");
      }
      setLoading(false);
    };

    fetchCompanies();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-600 h-screen">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">All Companies</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <Link
            href={`/companies/${company._id}`}
            key={company._id}
            className="bg-white shadow-md rounded-lg p-5 flex flex-col justify-between min-h-[220px]"
          >
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Building2 className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">{company.name}</h2>
              </div>
              <p className="text-gray-600">
                {company.description || "No description"}
              </p>
            </div>
            {company.website && (
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 hover:underline mt-4"
              >
                Visit Website <ExternalLink className="w-4 h-4 ml-1" />
              </a>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
