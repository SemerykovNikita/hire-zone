"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Briefcase, Loader2, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";
import { getFavorites, removeFavorite } from "@/actions/favoriteActions";

interface JobVacancy {
  _id: string;
  title: string;
  description: string;
  company: {
    name: string;
  };
}

interface Favorite {
  _id: string;
  jobVacancy: JobVacancy;
  createdAt: string;
}

export default function FavoritesPage() {
  const { data: session } = useSession();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!session?.user?.id) return;

    setLoading(true);
    const result = await getFavorites(session.user.id);

    if (result.success && result.data) {
      setFavorites(result.data);
    } else {
      setError(result.error || "Unable to fetch favorites.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, [session]);

  const handleRemove = async (jobVacancyId: string) => {
    if (!session?.user?.id) return;

    setRemovingId(jobVacancyId);
    const result = await removeFavorite(session.user.id, jobVacancyId);

    if (result.success) {
      await fetchFavorites();
    } else {
      alert(result.error || "Failed to remove favorite.");
    }

    setRemovingId(null);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-[50vh] text-red-600 h-screen">
        <AlertCircle className="w-6 h-6 mr-2" />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6 h-screen">
      <h1 className="text-3xl font-bold">Saved Jobs</h1>

      {favorites.length === 0 ? (
        <div className="text-center space-y-4">
          <p className="text-gray-600">You haven't saved any jobs yet.</p>
          <Link
            href="/jobs"
            className="inline-block px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
          >
            Find Jobs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {favorites.map((fav) => (
            <div
              key={fav._id}
              className="bg-white shadow-md rounded-lg p-5 flex flex-col space-y-2 relative"
            >
              <button
                onClick={() => handleRemove(fav.jobVacancy._id)}
                className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition"
                disabled={removingId === fav.jobVacancy._id}
              >
                {removingId === fav.jobVacancy._id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-5 h-5" />
                )}
              </button>

              <div className="flex items-center space-x-2">
                <Briefcase className="w-5 h-5 text-primary" />
                <h2 className="text-xl font-semibold">
                  {fav.jobVacancy.title}
                </h2>
              </div>
              <p className="text-gray-600 line-clamp-3">
                {fav.jobVacancy.description}
              </p>
              <p className="text-sm text-gray-500">
                Company: {fav.jobVacancy.company.name}
              </p>
              <Link
                href={`/job/${fav.jobVacancy._id}`}
                className="text-blue-600 hover:underline text-sm"
              >
                View job
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
