"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createApplication } from "@/actions/applicationActions";
import { getJobVacancyById } from "@/actions/jobVacancyActions";
import { saveResumeUrl, getUserResumes } from "@/actions/userActions";
import { put } from "@vercel/blob";
import {
  Briefcase,
  Building2,
  FileText,
  Loader2,
  AlertCircle,
  Upload,
  X,
  ChevronDown,
} from "lucide-react";

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
  const [showSuccessModal, setShowSuccessModal] = useState(false);
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
        setShowSuccessModal(true);
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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <div className="flex items-center space-x-3">
            <AlertCircle className="h-6 w-6 text-red-500" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!jobVacancy) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">No job vacancy found.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md text-center">
            <h2 className="text-xl font-semibold text-green-600 mb-4">
              Success!
            </h2>
            <p className="text-gray-700 mb-6">
              Your application has been submitted successfully.
            </p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            >
              Back to Home
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Job Header */}
          <div className="bg-primary/5 p-6 border-b border-gray-200">
            <div className="flex items-start space-x-4">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Apply for {jobVacancy.title}
                </h1>
                <div className="flex items-center text-gray-600">
                  <Building2 className="h-4 w-4 mr-2" />
                  <span>{jobVacancy.company.name}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Job Description */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-2">About the Position</h2>
            <p className="text-gray-600">{jobVacancy.description}</p>
          </div>

          {/* Application Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4" />
                  <span>Cover Letter</span>
                </div>
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                required
                className="w-full h-48 px-3 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary"
                placeholder="Tell us why you're the perfect fit for this position..."
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="resumeSelection"
                className="block text-sm font-medium text-gray-700"
              >
                Select Existing Resume
              </label>
              <div className="relative">
                <select
                  id="resumeSelection"
                  onChange={handleResumeSelection}
                  value={selectedResume}
                  className="w-full appearance-none px-4 py-3 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black transition-all pr-10"
                >
                  <option value="">Upload new resume</option>
                  {userResumes.map((resume, index) => (
                    <option key={index} value={resume.url}>
                      Resume from{" "}
                      {new Date(resume.uploadedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                  size={20}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="resumeFile"
                className="block text-sm font-medium text-gray-700"
              >
                Upload New Resume
              </label>
              <div className="relative">
                <input
                  type="file"
                  id="resumeFile"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="resumeFile"
                  className={`flex items-center justify-center w-full px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-all
                  ${
                    resumeFile
                      ? "border-black bg-gray-50"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  <div className="flex flex-col items-center">
                    {resumeFile ? (
                      <>
                        <FileText className="w-8 h-8 text-black mb-2" />
                        <p className="text-black font-medium">
                          {resumeFile.name}
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-gray-400 mb-2" />
                        <p className="text-gray-700">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-gray-500 text-sm mt-1">
                          PDF, DOC, or DOCX (Max 5MB)
                        </p>
                      </>
                    )}
                  </div>
                </label>
                {resumeFile && (
                  <button
                    type="button"
                    onClick={() => setResumeFile(null)}
                    className="absolute top-4 right-4 p-1 bg-gray-200 rounded-full hover:bg-gray-300 transition-all"
                  >
                    <X className="w-4 h-4 text-gray-600" />
                  </button>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={submitting}
                className={`w-full md:w-auto px-8 py-3 rounded-lg font-medium transition-all
                ${
                  submitting
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-black text-white hover:bg-gray-800"
                }`}
              >
                {submitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Application"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
