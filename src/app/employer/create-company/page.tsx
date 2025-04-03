"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import mongoose from "mongoose";
import { createCompany } from "@/actions/companyActions";
import { ICompanyCreate } from "@/types/company";
import { Building2, Globe, FileText, AlertCircle, Loader2 } from "lucide-react";
import Link from "next/link";

export default function CreateCompanyPage() {
  const [formData, setFormData] = useState<ICompanyCreate>({
    name: "",
    description: "",
    website: "",
    owner: new mongoose.Types.ObjectId(),
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!session?.user) {
      setError("You must be logged in to create a company.");
      setIsSubmitting(false);
      return;
    }

    const ownerId = new mongoose.Types.ObjectId(session.user.id);
    const newCompanyData: ICompanyCreate = { ...formData, owner: ownerId };

    try {
      const result = await createCompany(newCompanyData);
      if (result.success) {
        router.push("/employer/dashboard");
      } else {
        setError(result.error || "Failed to create company.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-primary/5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Building2 className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                Create Your Company Profile
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Set up your company profile to start posting job opportunities.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="text-red-700">{error}</p>
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                onChange={handleChange}
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
                    Creating Company...
                  </>
                ) : (
                  "Create Company"
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
