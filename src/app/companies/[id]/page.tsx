// @ts-nocheck

import { getCompanyById } from "@/actions/companyActions";
import JobVacancyModel from "@/models/JobVacancy";
import { dbConnect } from "@/config/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Building2, Globe, Briefcase, ChevronRight } from "lucide-react";

interface CompanyPageProps {
  params: { id: string };
}

export default async function CompanyPage({ params }: CompanyPageProps) {
  await dbConnect();

  const companyRes = await getCompanyById(params.id);

  if (!companyRes.success || !companyRes.data) {
    return notFound();
  }

  const company = companyRes.data;
  const vacancies = await JobVacancyModel.find({ company: company._id }).lean();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-black rounded-lg">
                  <Building2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-3xl font-semibold text-black">
                  {company.name}
                </h1>
              </div>
              <p className="text-gray-600 max-w-2xl leading-relaxed">
                {company.description || "No description available."}
              </p>
              {company.website && (
                <a
                  href={company.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-gray-600 hover:text-black transition-colors"
                >
                  <Globe className="w-4 h-4" />
                  <span className="border-b border-gray-300">
                    Visit Website
                  </span>
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center space-x-3">
            <Briefcase className="w-6 h-6 text-gray-700" />
            <h2 className="text-2xl font-semibold text-black">
              Open Positions
            </h2>
          </div>

          {vacancies.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-xl p-8 text-center">
              <p className="text-gray-500">
                This company has no active job listings.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {vacancies.map((vacancy) => (
                <div
                  key={vacancy._id}
                  className="group bg-white border border-gray-200 rounded-xl p-6 transition-all hover:shadow-md"
                >
                  <a href={`/jobs/${vacancy._id}`} className="block space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-medium text-black group-hover:text-gray-600 transition-colors">
                        {vacancy.title}
                      </h3>
                      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black transition-colors" />
                    </div>
                    <p className="text-gray-600 line-clamp-2 leading-relaxed">
                      {vacancy.description}
                    </p>
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
