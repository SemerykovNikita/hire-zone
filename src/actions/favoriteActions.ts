"use server";

import { dbConnect } from "@/config/db";
import FavoriteModel from "@/models/Favorite";

export async function addFavorite(userId: string, jobVacancyId: string) {
  await dbConnect();

  console.log(userId, jobVacancyId);
  const existingFavorite = await FavoriteModel.findOne({
    user: userId,
    jobVacancy: jobVacancyId,
  });

  if (existingFavorite) {
    return {
      success: false,
      error: "This job vacancy is already in favorites.",
    };
  }

  const newFavorite = new FavoriteModel({
    user: userId,
    jobVacancy: jobVacancyId,
  });

  const savedFavorite = await newFavorite.save();

  return {
    success: true,
    data: savedFavorite,
  };
}

export async function removeFavorite(userId: string, jobVacancyId: string) {
  await dbConnect();

  const deletedFavorite = await FavoriteModel.findOneAndDelete({
    user: userId,
    jobVacancy: jobVacancyId,
  });

  if (!deletedFavorite) {
    return {
      success: false,
      error: "Favorite job vacancy not found.",
    };
  }

  return {
    success: true,
    message: "Job vacancy removed from favorites.",
  };
}

export async function getFavorites(userId: string) {
  await dbConnect();

  const favorites = await FavoriteModel.find({ user: userId })
    .populate("jobVacancy")
    .lean();

  if (!favorites || favorites.length === 0) {
    return {
      success: false,
      error: "No favorite job vacancies found.",
    };
  }

  const plainFavorites = favorites.map((favorite) => ({
    ...favorite,
    _id: favorite._id.toString(),
    jobVacancy: {
      ...favorite.jobVacancy,
      _id: favorite.jobVacancy._id.toString(),
    },
    createdAt: favorite.createdAt.toISOString(),
  }));

  return {
    success: true,
    data: plainFavorites,
  };
}
