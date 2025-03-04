"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createApplication } from "@/actions/applicationActions";
import { getJobVacancyById } from "@/actions/jobVacancyActions";
import { saveResumeUrl, getUserResumes } from "@/actions/userActions";
import { put } from "@vercel/blob";

export default function ApplyJobPage({ params }: { params: { id: string } }) {
  const [jobVacancy, setJobVacancy] = useState<any | null>(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [selectedResume, setSelectedResume] = useState<string>("");
  const [userResumes, setUserResumes] = useState<
    { url: string; uploadedAt: string }[]
  >([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

    const fetchUserResumes = async () => {
      const result = await getUserResumes();
      if (result.success) {
        setUserResumes(result.data);
      }
    };

    fetchJobVacancy();
    fetchUserResumes();
  }, [vacancyId]);

  console.log(userResumes);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
      setSelectedResume("");
    }
  };

  const handleResumeSelection = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedResume(e.target.value);
    setResumeFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSubmitting(true);
    setError(null);

    try {
      let uploadedResumeUrl = selectedResume;

      if (resumeFile) {
        const blob = await put(resumeFile.name, resumeFile, {
          contentType: resumeFile.type,
          access: "public",
          token:
            "vercel_blob_rw_1eKZn9vXTKWumt66_1DX2MbYr9eCuOfeMkSH7aP9lsZMZ0A",
        });

        uploadedResumeUrl = blob.url;

        const saveResumeResult = await saveResumeUrl(uploadedResumeUrl);
        if (!saveResumeResult.success) {
          throw new Error(saveResumeResult.error || "Failed to save resume.");
        }
      }

      const applicationData = {
        applicant: "userId-from-session",
        jobVacancy: vacancyId,
        coverLetter,
        resumeUrl: uploadedResumeUrl,
      };

      const result = await createApplication(applicationData);

      if (result.success) {
        router.push("/");
      } else {
        setError(result.error || "Failed to submit the application.");
      }
    } catch (err: any) {
      setError(
        err.message || "An error occurred while submitting the application."
      );
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
          <label htmlFor="resumeSelection">Select Existing Resume</label>
          <select
            id="resumeSelection"
            onChange={handleResumeSelection}
            value={selectedResume}
          >
            <option value="">Upload new resume</option>
            {userResumes.map((resume) => (
              <option key={resume.url} value={resume.url}>
                {new Date(resume.uploadedAt).toLocaleDateString()}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="resumeFile">Upload New Resume</label>
          <input
            type="file"
            id="resumeFile"
            accept=".pdf,.doc,.docx"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
