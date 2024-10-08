"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserCompany } from "@/actions/companyActions";
import { IJobVacancyCreate } from "@/types/job";
import mongoose from "mongoose";
import { createJobVacancy } from "@/actions/jobVacancyActions";

export default function CreateJobPage() {
  const [formData, setFormData] = useState<IJobVacancyCreate>({
    title: "",
    description: "",
    requirements: [""],
    salaryRange: { min: 0, max: 0 },
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
      if (session && session.user) {
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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

  const handleSalaryChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "min" | "max"
  ) => {
    // Логируем текущее состояние перед обновлением
    console.log("Updating salary range:", formData.salaryRange);

    setFormData((prevData) => {
      const newSalaryRange = {
        ...prevData.salaryRange,
        [type]: e.target.value ? +e.target.value : 0, // Присваиваем значение или 0
      };

      // Логируем новое состояние для отладки
      console.log("New salary range:", newSalaryRange);

      return {
        ...prevData,
        salaryRange: newSalaryRange,
      };
    });
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!hasCompany) {
    return <p>You need to create a company before posting a job.</p>;
  }

  return (
    <div>
      <h1>Create Job Vacancy</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Job Title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleTextAreaChange}
          required
        />
        <div>
          <label>Requirements:</label>
          {formData.requirements.map((requirement, index) => (
            <div key={index}>
              <input
                type="text"
                placeholder="Requirement"
                value={requirement}
                onChange={(e) => handleRequirementChange(e, index)}
              />
            </div>
          ))}
          <button type="button" onClick={addRequirementField}>
            Add Requirement
          </button>
        </div>
        <div>
          <label>Salary Range:</label>
          <input
            type="number"
            name="min"
            placeholder="Minimum Salary"
            value={formData.salaryRange?.min}
            onChange={(e) => handleSalaryChange(e, "min")}
          />
          <input
            type="number"
            name="max"
            placeholder="Maximum Salary"
            value={formData.salaryRange?.max || ""}
            onChange={(e) => handleSalaryChange(e, "max")}
          />
        </div>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating..." : "Create Job Vacancy"}
        </button>
      </form>
    </div>
  );
}
