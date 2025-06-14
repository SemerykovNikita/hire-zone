// @ts-nocheck

"use client";

import { getUserDashboardData } from "@/actions/userActions";
import { ErrorState } from "@/app/job/[id]/components/ErrorState";
import { IApplication } from "@/models/Application";
import { ICompany } from "@/models/Company";
import { IUser } from "@/models/User";
import { useEffect, useState } from "react";
import { ApplicationList } from "./components/ApplicationList";
import { CompanySection } from "./components/CompanySection";
import { LoadingState } from "./components/LoadingState";
import { ProfileHeader } from "./components/ProfileHeader";

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
          setError(result.error || "Не вдалося завантажити дані профілю.");
        }
      } catch (err) {
        setError("Сталася невідома помилка.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, []);

  if (loading) return <LoadingState />;
  if (error) return <ErrorState message={error} />;
  if (!profileData) return <ErrorState message="Дані профілю не знайдено." />;

  const { user, company, applications } = profileData;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <ProfileHeader user={user} />

          {user.role === "employer" && company ? (
            <CompanySection company={company} applications={applications} />
          ) : (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">
                Ваші заявки на вакансії
              </h2>
              <ApplicationList applications={applications} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
