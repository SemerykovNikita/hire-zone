"use client";

import { getUserDashboardData } from "@/actions/userActions";
import { IApplication } from "@/models/Application";
import { ICompany } from "@/models/Company";
import { IUser } from "@/models/User";
import { useEffect, useState } from "react";

interface ProfileData {
  user: IUser;
  company?: ICompany;
  applications: IApplication[];
}

export default function ProfilePage() {
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const result = await getUserDashboardData();
        if (result.success) {
          setProfileData(result.data);
        } else {
          setError(result.error || "Failed to load profile data.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  if (!profileData) {
    return <p>No data found.</p>;
  }

  const { user, company, applications } = profileData;

  return (
    <div>
      <h1>
        Welcome, {user.firstName} {user.lastName}!
      </h1>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>

      {user.role === "employer" && company ? (
        <div>
          <h2>Your Company: {company.name}</h2>
          <p>{company.description}</p>
          <h3>Job Applications for your Company:</h3>
          {applications.length > 0 ? (
            <ul>
              {applications.map((application) => (
                <li key={application._id}>
                  Job: {application.jobVacancy.title}, Applicant:{" "}
                  {application.applicant.firstName}{" "}
                  {application.applicant.lastName}
                </li>
              ))}
            </ul>
          ) : (
            <p>No applications found for your company.</p>
          )}
        </div>
      ) : (
        <div>
          <h3>Your Job Applications:</h3>
          {applications.length > 0 ? (
            <ul>
              {applications.map((application) => (
                <li key={application._id}>
                  Job: {application.jobVacancy.title}, Status:{" "}
                  {application.status}
                </li>
              ))}
            </ul>
          ) : (
            <p>You have not applied for any jobs.</p>
          )}
        </div>
      )}
    </div>
  );
}
