"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { getUserCompany, deleteCompany } from "@/actions/companyActions";
import {
  getJobVacanciesByCompanyId,
  toggleJobVacancyStatus,
  deleteJobVacancy,
} from "@/actions/jobVacancyActions";
import { IJobVacancy } from "@/types/job";
import Modal from "react-modal";

export default function EmployerDashboard() {
  const [vacancies, setVacancies] = useState<IJobVacancy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [companyId, setCompanyId] = useState<string | null>(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [companyModalIsOpen, setCompanyModalIsOpen] = useState(false);
  const [vacancyToDelete, setVacancyToDelete] = useState<string | null>(null);
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
        setCompanyId(companyId);

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

  const handleToggleStatus = async (vacancyId: string) => {
    const result = await toggleJobVacancyStatus(vacancyId);
    if (result.success) {
      setVacancies((prevVacancies) =>
        prevVacancies.map((vacancy) =>
          vacancy._id === vacancyId
            ? { ...vacancy, isActive: !vacancy.isActive }
            : vacancy
        )
      );
    } else {
      alert(result.error || "Failed to update job vacancy status.");
    }
  };

  const handleDeleteVacancy = async () => {
    if (!vacancyToDelete) return;

    const result = await deleteJobVacancy(vacancyToDelete);
    if (result.success) {
      setVacancies((prevVacancies) =>
        prevVacancies.filter((vacancy) => vacancy._id !== vacancyToDelete)
      );
      setModalIsOpen(false);
    } else {
      alert(result.error || "Failed to delete job vacancy.");
    }
  };

  const handleDeleteCompany = async () => {
    if (!companyId) return;

    const result = await deleteCompany(companyId);
    if (result.success) {
      router.push("/employer/create-company");
    } else {
      alert(result.error || "Failed to delete company.");
    }
    setCompanyModalIsOpen(false);
  };

  const openModal = (vacancyId: string) => {
    setVacancyToDelete(vacancyId);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setVacancyToDelete(null);
  };

  const openCompanyModal = () => {
    setCompanyModalIsOpen(true);
  };

  const closeCompanyModal = () => {
    setCompanyModalIsOpen(false);
  };

  const handleViewReviews = (vacancyId: string) => {
    router.push(`/employer/job-vacancies/${vacancyId}/reviews`);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Your Job Vacancies</h1>

      {/* Button for deleting company */}
      <button onClick={openCompanyModal} style={{ marginBottom: "20px" }}>
        Delete Company
      </button>

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
              <th>Status</th>
              <th>Actions</th>
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
                <td>{vacancy.isActive ? "Active" : "Inactive"}</td>
                <td>
                  <button onClick={() => handleToggleStatus(vacancy._id)}>
                    {vacancy.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button onClick={() => openModal(vacancy._id)}>Delete</button>
                  <button onClick={() => handleViewReviews(vacancy._id)}>
                    View Reviews
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no job vacancies.</p>
      )}

      {/* Modal for confirming job vacancy deletion */}
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal}>
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this job vacancy?</p>
        <button onClick={handleDeleteVacancy}>Yes, Delete</button>
        <button onClick={closeModal}>Cancel</button>
      </Modal>

      {/* Modal for confirming company deletion */}
      <Modal isOpen={companyModalIsOpen} onRequestClose={closeCompanyModal}>
        <h2>Confirm Company Deletion</h2>
        <p>
          Are you sure you want to delete your company? This will also delete
          all job vacancies related to your company.
        </p>
        <button onClick={handleDeleteCompany}>Yes, Delete Company</button>
        <button onClick={closeCompanyModal}>Cancel</button>
      </Modal>
    </div>
  );
}
