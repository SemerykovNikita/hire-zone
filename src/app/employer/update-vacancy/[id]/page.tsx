// @ts-nocheck

"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IJobVacancyCreate } from "@/types/job";
import {
  getJobVacancyById,
  updateJobVacancy,
} from "@/actions/jobVacancyActions";
import {
  Briefcase,
  MapPin,
  DollarSign,
  ListPlus,
  X,
  Plus,
  Save,
  Loader2,
} from "lucide-react";

export default function UpdateVacancyPage() {
  const { id } = useParams();
  const [formData, setFormData] = useState<IJobVacancyCreate>({
    title: "",
    description: "",
    requirements: [""],
    salaryRange: { min: 0, max: 0 },
    city: "",
    company: "",
    postedBy: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVacancy = async () => {
      if (!id) return;
      try {
        const result = await getJobVacancyById(id);
        if (result.success && result.data) {
          setFormData(result.data);
        } else {
          setError(result.error || "Failed to load vacancy details.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchVacancy();
  }, [id]);

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

  const removeRequirementField = (index: number) => {
    setFormData((prevData) => ({
      ...prevData,
      requirements: prevData.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleSalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    setFormData((prevData) => ({
      ...prevData,
      salaryRange: {
        ...prevData.salaryRange,
        [type]: +e.target.value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await updateJobVacancy(id.toString(), formData);
      if (result.success) {
        router.push("/employer/dashboard");
      } else {
        setError(result.error || "Failed to update vacancy.");
      }
    } catch (err) {
      setError("An unknown error occurred.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
            <Briefcase className="h-8 w-8" />
            Update Job Vacancy
          </h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Job Title
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  placeholder="Senior Software Engineer"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                <Briefcase className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                placeholder="Detailed job description..."
                value={formData.description}
                onChange={handleChange}
                required
                className="w-full p-4 min-h-[150px] border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                />
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Salary Range
              </label>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    name="min"
                    placeholder="Minimum"
                    value={formData.salaryRange?.min}
                    onChange={(e) => handleSalaryChange(e, "min")}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    name="max"
                    placeholder="Maximum"
                    value={formData.salaryRange?.max}
                    onChange={(e) => handleSalaryChange(e, "max")}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                  />
                  <DollarSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Requirements
              </label>
              <div className="space-y-3">
                {formData.requirements.map((requirement, index) => (
                  <div key={index} className="flex gap-2">
                    <div className="relative flex-1">
                      <input
                        type="text"
                        placeholder="Add requirement"
                        value={requirement}
                        onChange={(e) => handleRequirementChange(e, index)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-black transition-colors"
                      />
                      <ListPlus className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRequirementField(index)}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addRequirementField}
                  className="w-full flex items-center justify-center gap-2 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <Plus className="h-5 w-5" />
                  Add Requirement
                </button>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
              >
                <Save className="h-5 w-5" />
                Update Vacancy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
