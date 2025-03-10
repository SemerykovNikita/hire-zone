"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getJobVacancyById } from "@/actions/jobVacancyActions";
import { addFavorite, removeFavorite } from "@/actions/favoriteActions";
import { useSession } from "next-auth/react";

export default function JobVacancyDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [jobVacancy, setJobVacancy] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleApplyClick = () => {
    router.push(`/jobseeker/apply/${vacancyId}`);
  };

  const handleFavoriteToggle = async () => {
    if (!session?.user) {
      alert("Please log in to manage favorites.");
      return;
    }
    const userId = session.user.id;

    console.log(userId);
    if (isFavorite) {
      const result = await removeFavorite(userId, vacancyId);
      if (result.success) {
        setIsFavorite(false);
      } else {
        alert(result.error || "Failed to remove from favorites.");
      }
    } else {
      const result = await addFavorite(userId, vacancyId);
      if (result.success) {
        setIsFavorite(true);
      } else {
        alert(result.error || "Failed to add to favorites.");
      }
    }
  };

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

      <button onClick={handleApplyClick}>Submit Application</button>
      <button onClick={handleFavoriteToggle}>
        {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
      </button>
    </div>
  );
}
