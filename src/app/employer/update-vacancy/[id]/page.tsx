"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { IJobVacancyCreate } from "@/types/job";
import {
  getJobVacancyById,
  updateJobVacancy,
} from "@/actions/jobVacancyActions";

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
      const result = await updateJobVacancy(id, formData);
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
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Update Job Vacancy</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Job Title:</label>
          <input
            type="text"
            name="title"
            placeholder="Job Title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            placeholder="Job Description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>City:</label>
          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
            required
          />
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
            value={formData.salaryRange?.max}
            onChange={(e) => handleSalaryChange(e, "max")}
          />
        </div>
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
              <button
                type="button"
                onClick={() => removeRequirementField(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button type="button" onClick={addRequirementField}>
            Add Requirement
          </button>
        </div>
        <button type="submit">Update Vacancy</button>
      </form>
    </div>
  );
}
