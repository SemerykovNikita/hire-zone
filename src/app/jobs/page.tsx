"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getJobVacanciesBySearch } from "@/actions/jobVacancyActions";
import { IJobVacancyExtended } from "@/types/job";
import { useRouter } from "next/navigation";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const city = searchParams.get("city");
  const [vacancies, setVacancies] = useState<IJobVacancyExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const response = await getJobVacanciesBySearch(title, city);

        if (response.success) {
          const vacancies = Array.isArray(response.data) ? response.data : [];
          setVacancies(vacancies);
        } else {
          setError(response.error || "Failed to fetch job vacancies.");
        }
      } catch (err) {
        setError("An error occurred while fetching job vacancies.");
      } finally {
        setLoading(false);
      }
    };
    fetchVacancies();
  }, [title, city]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Job Vacancies in {city}</h1>
      {vacancies.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Salary</th>
              <th>City</th>
              <th>Requirements</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {vacancies.map((vacancy) => (
              <tr key={vacancy._id}>
                <td>{vacancy.title}</td>
                <td>{vacancy.description}</td>
                <td>
                  {vacancy.salaryRange?.min} - {vacancy.salaryRange?.max}
                </td>
                <td>{vacancy.city}</td>
                <td>{vacancy.requirements.join(", ")}</td>
                <td>
                  <button onClick={() => router.push(`/job/${vacancy._id}`)}>
                    Go to Vacancy
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No vacancies found for this search.</p>
      )}
    </div>
  );
}
