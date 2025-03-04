import { Building2, Globe, Info } from "lucide-react";

interface CompanyInfoProps {
  company: {
    name: string;
    website?: string;
    description?: string;
  };
}

export function CompanyInfo({ company }: CompanyInfoProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-semibold mb-6">Company Details</h2>

      <div className="space-y-4">
        <div className="flex items-start space-x-3">
          <Building2 className="h-5 w-5 text-gray-400 mt-1" />
          <div>
            <p className="font-medium text-gray-700">Company Name</p>
            <p className="text-gray-600">{company.name}</p>
          </div>
        </div>

        {company.website && (
          <div className="flex items-start space-x-3">
            <Globe className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Website</p>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {company.website}
              </a>
            </div>
          </div>
        )}

        {company.description && (
          <div className="flex items-start space-x-3">
            <Info className="h-5 w-5 text-gray-400 mt-1" />
            <div>
              <p className="font-medium text-gray-700">Description</p>
              <p className="text-gray-600">{company.description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
