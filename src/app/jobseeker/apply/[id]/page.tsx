"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { createApplication } from "@/actions/applicationActions";
import { getJobVacancyById } from "@/actions/jobVacancyActions";

export default function ApplyJobPage({ params }: { params: { id: string } }) {
  const [jobVacancy, setJobVacancy] = useState<any | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeUrl, setResumeUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { data: session } = useSession();
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session || !session.user) {
      setError("You must be logged in to submit an application.");
      return;
    }

    setSubmitting(true);
    try {
      const applicationData = {
        applicant: session.user.id,
        jobVacancy: vacancyId,
        coverLetter,
        resumeUrl,
      };
      const result = await createApplication(applicationData);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Failed to submit the application.");
      }
    } catch (err) {
      setError("An error occurred while submitting the application.");
    } finally {
      setSubmitting(false);
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
      <h1>Apply for {jobVacancy.title}</h1>
      <p>
        <strong>Company:</strong> {jobVacancy.company.name}
      </p>
      <p>
        <strong>Description:</strong> {jobVacancy.description}
      </p>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="coverLetter">Cover Letter</label>
          <textarea
            id="coverLetter"
            value={coverLetter}
            onChange={(e) => setCoverLetter(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="resumeUrl">Resume URL</label>
          {/* TODO upload files */}
          <input
            type="url"
            id="resumeUrl"
            value={resumeUrl}
            onChange={(e) => setResumeUrl(e.target.value)}
            placeholder="https://example.com/your-resume.pdf"
            required
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
