"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserCompany } from "@/actions/companyActions";
import { getJobVacanciesByCompanyId } from "@/actions/jobVacancyActions";
import { IJobVacancy } from "@/types/job";

export default function EmployerDashboard() {
  const [vacancies, setVacancies] = useState<IJobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    const fetchCompanyAndVacancies = async () => {
      try {
        const companyResponse = await getUserCompany();
        if (!companyResponse.success || !companyResponse.data) {
          router.push("/employer/create-company");
          return;
        }

        const companyId = companyResponse.data._id.toString();
        const jobVacanciesResponse = await getJobVacanciesByCompanyId(
          companyId
        );

        if (
          jobVacanciesResponse.success &&
          Array.isArray(jobVacanciesResponse.data)
        ) {
          setVacancies(jobVacanciesResponse.data);
        } else {
          setError("No job vacancies found for this company.");
        }
      } catch (err) {
        setError("An error occurred while fetching company or vacancies.");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchCompanyAndVacancies();
    }
  }, [session, router]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Your Job Vacancies</h1>
      {vacancies.length > 0 ? (
        <table
          border={1}
          cellPadding="10"
          style={{ width: "100%", borderCollapse: "collapse" }}
        >
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Salary Range</th>
              <th>Requirements</th>
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
                <td>{vacancy.requirements.join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no job vacancies.</p>
      )}
    </div>
  );
}
