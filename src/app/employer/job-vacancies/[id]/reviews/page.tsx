"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getApplicationsByJobVacancyId } from "@/actions/applicationActions";
import { IApplication } from "@/models/Application";

export default function JobVacancyReviewsPage() {
  const [applications, setApplications] = useState<IApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { id: vacancyId } = router.query;

  useEffect(() => {
    const fetchApplications = async () => {
      if (vacancyId) {
        try {
          const result = await getApplicationsByJobVacancyId(
            vacancyId as string
          );
          if (result.success && Array.isArray(result.data)) {
            setApplications(result.data);
          } else {
            setError(result.error || "Failed to load applications.");
          }
        } catch (err) {
          setError("An unknown error occurred.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchApplications();
  }, [vacancyId]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Applications for Job Vacancy</h1>
      {applications.length > 0 ? (
        <ul>
          {applications.map((application) => (
            <li key={application._id}>
              <p>
                <strong>Applicant Name:</strong>{" "}
                {application.applicant.firstName}{" "}
                {application.applicant.lastName}
              </p>
              <p>
                <strong>Email:</strong> {application.applicant.email}
              </p>
              <p>
                <strong>Status:</strong> {application.status}
              </p>
              <p>
                <strong>Cover Letter:</strong>{" "}
                {application.coverLetter || "N/A"}
              </p>
              <p>
                <strong>Resume:</strong>{" "}
                <a
                  href={application.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume
                </a>
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No applications found for this job vacancy.</p>
      )}
    </div>
  );
}
