// @ts-nocheck

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserCompany, updateCompany } from "@/actions/companyActions";
import { IUpdateCompany } from "@/types/company";
import { ICompany } from "@/models/Company";
import {
  Building2,
  Globe,
  FileText,
  AlertCircle,
  Loader2,
  Save,
} from "lucide-react";
import Link from "next/link";

export default function UpdateCompanyPage() {
  const [company, setCompany] = useState<ICompany | null>(null);
  const [formData, setFormData] = useState<IUpdateCompany>({
    name: "",
    description: "",
    website: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companyResponse = await getUserCompany();
        if (!companyResponse.success || !companyResponse.data) {
          router.push("/employer/create-company");
          return;
        }

        setCompany(companyResponse.data);
        setFormData({
          name: companyResponse.data.name,
          description: companyResponse.data.description || "",
          website: companyResponse.data.website || "",
        });
      } catch (err) {
        setError("An error occurred while fetching the company.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCompany();
    }
  }, [session, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company) return;

    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await updateCompany(company._id, formData);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => router.push("/employer/dashboard"), 2000);
      } else {
        setError(result.error || "Failed to update the company.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-primary/5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                Update Company Profile
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Keep your company information up to date to attract the best
              candidates.
            </p>
          </div>

          {(error || success) && (
            <div className={`p-4 ${error ? "bg-red-50" : "bg-green-50"}`}>
              <div className="flex items-center space-x-2">
                <AlertCircle
                  className={`h-5 w-5 ${
                    error ? "text-red-500" : "text-green-500"
                  }`}
                />
                <p className={error ? "text-red-700" : "text-green-700"}>
                  {error || "Company updated successfully! Redirecting..."}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <Building2 className="h-4 w-4" />
                  <span>Company Name</span>
                </div>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Enter your company name"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Company Description</span>
                </div>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Tell us about your company..."
              />
            </div>

            <div>
              <label
                htmlFor="website"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <Globe className="h-4 w-4" />
                  <span>Company Website</span>
                </div>
              </label>
              <input
                type="url"
                id="website"
                name="website"
                value={formData.website}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="https://example.com"
              />
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-black flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Update Company
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-center text-sm">
              <span className="text-gray-500">
                Need help?{" "}
                <Link
                  href="/contact"
                  className="font-medium text-primary hover:text-primary/80"
                >
                  Contact support
                </Link>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
