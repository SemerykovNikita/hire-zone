"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserCompany } from "@/actions/companyActions";
import { IJobVacancyCreate } from "@/types/job";
import mongoose from "mongoose";
import { createJobVacancy } from "@/actions/jobVacancyActions";
import {
  Briefcase,
  MapPin,
  FileText,
  DollarSign,
  Plus,
  X,
  AlertCircle,
  Loader2,
  Building2,
} from "lucide-react";
import Link from "next/link";

export default function CreateJobPage() {
  const [formData, setFormData] = useState<IJobVacancyCreate>({
    title: "",
    description: "",
    requirements: [""],
    salaryRange: { min: 0, max: 0 },
    city: "",
    company: "",
    postedBy: "",
  });

  const [hasCompany, setHasCompany] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const checkCompany = async () => {
      if (session?.user) {
        try {
          const companyResponse = await getUserCompany();
          if (companyResponse.success && companyResponse.data) {
            const companyId = companyResponse.data
              ._id as mongoose.Types.ObjectId;
            setFormData((prevData) => ({
              ...prevData,
              company: companyId.toString(),
              postedBy: session.user.id,
            }));
            setHasCompany(true);
          } else {
            setHasCompany(false);
            setError("You need to create a company before posting a job.");
          }
        } catch (err) {
          setError("An error occurred while fetching company data.");
        }
      }
    };

    if (session) {
      checkCompany();
    }
  }, [session]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRequirementChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = e.target.value;
    setFormData({ ...formData, requirements: newRequirements });
  };

  const addRequirementField = () => {
    setFormData((prevData) => ({
      ...prevData,
      requirements: [...prevData.requirements, ""],
    }));
  };

  const removeRequirement = (index: number) => {
    if (formData.requirements.length > 1) {
      setFormData((prevData) => ({
        ...prevData,
        requirements: prevData.requirements.filter((_, i) => i !== index),
      }));
    }
  };

  const handleSalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    const value = e.target.value ? parseInt(e.target.value) : 0;
    setFormData((prevData) => ({
      ...prevData,
      salaryRange: {
        ...prevData.salaryRange,
        [type]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasCompany) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const result = await createJobVacancy(formData);
      if (result.success) {
        router.push("/employer/dashboard");
      } else {
        setError(result.error || "Failed to create job vacancy.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!hasCompany) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6 text-center">
          <Building2 className="mx-auto h-12 w-12 text-primary" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Company Required
          </h2>
          <p className="mt-2 text-gray-600">
            You need to create a company profile before posting job vacancies.
          </p>
          <Link
            href="/employer/create-company"
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90"
          >
            Create Company Profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-primary/5 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <Briefcase className="h-8 w-8 text-primary" />
              <h1 className="text-2xl font-bold text-gray-900">
                Post a New Job
              </h1>
            </div>
            <p className="mt-2 text-gray-600">
              Create a new job posting to find the perfect candidate.
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
                htmlFor="title"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-4 w-4" />
                  <span>Job Title</span>
                </div>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="e.g., Senior Software Engineer"
              />
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Job Description</span>
                </div>
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                rows={6}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Describe the role, responsibilities, and ideal candidate..."
              />
            </div>

            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4" />
                  <span>Location</span>
                </div>
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="e.g., New York, NY"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <div className="space-y-3">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(e, index)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                      placeholder="e.g., 5+ years of experience with React"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRequirement(index)}
                        className="p-2 text-gray-400 hover:text-red-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirementField}
                  className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4" />
                  <span>Salary Range (Annual)</span>
                </div>
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    value={formData.salaryRange.min || ""}
                    onChange={(e) => handleSalaryChange(e, "min")}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Minimum"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={formData.salaryRange.max || ""}
                    onChange={(e) => handleSalaryChange(e, "max")}
                    min={formData.salaryRange.min}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                    placeholder="Maximum"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg text-white bg-black hover:bg-white hover:text-black hover:border-black hover:border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                    Creating Job Posting...
                  </>
                ) : (
                  "Post Job"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
