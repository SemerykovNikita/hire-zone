"use client";

import { useState, useEffect } from "react";
import {
  getAdminStatistics,
  deleteUser,
  deleteCompany,
  deleteJobVacancy,
} from "@/actions/adminActions";
import { Chart } from "react-chartjs-2";
import "chart.js/auto";

export default function AdminDashboard() {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const result = await getAdminStatistics();

        if (result.success) {
          setStatistics(result.data);
        } else {
          setError(result.error || "Failed to fetch statistics.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const handleDeleteUser = async (userId) => {
    if (confirm("Are you sure you want to delete this user?")) {
      const result = await deleteUser(userId);
      if (result.success) {
        alert("User deleted successfully.");
        location.reload();
      } else {
        alert(result.error || "Failed to delete user.");
      }
    }
  };

  const handleDeleteCompany = async (companyId) => {
    if (confirm("Are you sure you want to delete this company?")) {
      const result = await deleteCompany(companyId);
      if (result.success) {
        alert("Company deleted successfully.");
        location.reload();
      } else {
        alert(result.error || "Failed to delete company.");
      }
    }
  };

  const handleDeleteJobVacancy = async (vacancyId) => {
    if (confirm("Are you sure you want to delete this job vacancy?")) {
      const result = await deleteJobVacancy(vacancyId);
      if (result.success) {
        alert("Job vacancy deleted successfully.");
        location.reload();
      } else {
        alert(result.error || "Failed to delete job vacancy.");
      }
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  const {
    counts,
    trends: { newUsersByDay, applicationsByDay, jobVacanciesByDay },
  } = statistics;

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Statistics</h2>
        <p>Total Users: {counts.userCount}</p>
        <p>Total Companies: {counts.companyCount}</p>
        <p>Total Job Vacancies: {counts.jobVacancyCount}</p>
        <p>Total Applications: {counts.applicationCount}</p>
      </section>

      <section>
        <h2>Trends</h2>
        <div style={{ display: "flex", gap: "20px" }}>
          <div style={{ width: "30%" }}>
            <h3>New Users by Day</h3>
            <Chart
              type="line"
              data={{
                labels: newUsersByDay.map((item) => item._id),
                datasets: [
                  {
                    label: "New Users",
                    data: newUsersByDay.map((item) => item.count),
                    borderColor: "#42A5F5",
                    backgroundColor: "rgba(66, 165, 245, 0.5)",
                  },
                ],
              }}
            />
          </div>

          <div style={{ width: "30%" }}>
            <h3>Applications by Day</h3>
            <Chart
              type="line"
              data={{
                labels: applicationsByDay.map((item) => item._id),
                datasets: [
                  {
                    label: "Applications",
                    data: applicationsByDay.map((item) => item.count),
                    borderColor: "#66BB6A",
                    backgroundColor: "rgba(102, 187, 106, 0.5)",
                  },
                ],
              }}
            />
          </div>

          <div style={{ width: "30%" }}>
            <h3>Job Vacancies by Day</h3>
            <Chart
              type="line"
              data={{
                labels: jobVacanciesByDay.map((item) => item._id),
                datasets: [
                  {
                    label: "Job Vacancies",
                    data: jobVacanciesByDay.map((item) => item.count),
                    borderColor: "#FFA726",
                    backgroundColor: "rgba(255, 167, 38, 0.5)",
                  },
                ],
              }}
            />
          </div>
        </div>
      </section>

      <section>
        <h2>Actions</h2>
        <button onClick={() => handleDeleteUser("USER_ID")}>Delete User</button>
        <button onClick={() => handleDeleteCompany("COMPANY_ID")}>
          Delete Company
        </button>
        <button onClick={() => handleDeleteJobVacancy("JOB_VACANCY_ID")}>
          Delete Job Vacancy
        </button>
      </section>
    </div>
  );
}
