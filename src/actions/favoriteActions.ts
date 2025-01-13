"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/config/db";
import FavoriteModel from "@/models/Favorite";

export async function addFavorite(jobVacancyId: string) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

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

export async function removeFavorite(jobVacancyId: string) {
  await dbConnect();
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User not authenticated");
  }

  const userId = session.user.id;

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

export async function getFavorites() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const favorites = await FavoriteModel.find({ user: userId })
      .populate({
        path: "jobVacancy",
        populate: {
          path: "company",
          select: "name description website",
        },
        select:
          "title description requirements salaryRange city isActive createdAt",
      })
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
        company: {
          ...favorite.jobVacancy.company,
          _id: favorite.jobVacancy.company._id.toString(),
        },
      },
      createdAt: favorite.createdAt.toISOString(),
    }));

    return {
      success: true,
      data: plainFavorites,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
