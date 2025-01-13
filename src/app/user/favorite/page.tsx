"use client";

import { useEffect, useState } from "react";
import { getFavorites } from "@/actions/favoriteActions";

export default function FavoriteJobVacanciesPage() {
  const [favorites, setFavorites] = useState<any>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const result = await getFavorites();
        if (result.success) {
          setFavorites(result.data);
        } else {
          setError(result.error || "Failed to load favorite job vacancies.");
        }
      } catch (err) {
        setError("An unknown error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h1>Your Favorite Job Vacancies</h1>
      {favorites.length > 0 ? (
        <ul>
          {favorites.map((favorite) => (
            <li key={favorite._id}>
              <p>
                <strong>Title:</strong> {favorite.jobVacancy.title}
              </p>
              <p>
                <strong>Description:</strong> {favorite.jobVacancy.description}
              </p>
              <p>
                <strong>Company:</strong> {favorite.jobVacancy.company.name}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>You have no favorite job vacancies.</p>
      )}
    </div>
  );
}
