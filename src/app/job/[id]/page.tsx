"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { IJobVacancyFull } from "@/types/job";
import { getJobVacancyById } from "@/actions/jobVacancyActions";

export default function JobVacancyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [jobVacancy, setJobVacancy] = useState<IJobVacancyFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const vacancyId = params.id;

  useEffect(() => {
    const fetchJobVacancy = async () => {
      try {
        const result = await getJobVacancyById(vacancyId);

        if (result.success && result.data) {
          setJobVacancy(result.data);
        } else {
          setError(result.error || "Failed to fetch job vacancy details.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchJobVacancy();
  }, [vacancyId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!jobVacancy) {
    return <p>No job vacancy found.</p>;
  }

  return (
    <div>
      <h1>{jobVacancy.title}</h1>
      <p>
        <strong>Company:</strong> {jobVacancy.company.name}
      </p>
      <p>
        <strong>Location:</strong> {jobVacancy.company.city}
      </p>
      <p>
        <strong>Description:</strong> {jobVacancy.description}
      </p>
      <p>
        <strong>Salary:</strong> {jobVacancy.salaryRange?.min} -{" "}
        {jobVacancy.salaryRange?.max}
      </p>
      <p>
        <strong>Requirements:</strong> {jobVacancy.requirements.join(", ")}
      </p>

      <h2>Company Details</h2>
      <p>
        <strong>Company Name:</strong> {jobVacancy.company.name}
      </p>
      <p>
        <strong>Website:</strong> {jobVacancy.company.website || "N/A"}
      </p>
      <p>
        <strong>Description:</strong> {jobVacancy.company.description || "N/A"}
      </p>
    </div>
  );
}
