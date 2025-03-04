"use server";

import { dbConnect } from "@/config/db";
import CategoryModel, { ICategory } from "@/models/Categories";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import JobVacancyModel from "@/models/JobVacancy";

const isAdmin = (role: string) => role === "admin";

export async function createCategory(name: string) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !isAdmin(session.user.role)) {
      throw new Error("Unauthorized: Only admins can create categories.");
    }

    const newCategory = new CategoryModel({ name });
    await newCategory.save();

    return {
      success: true,
      message: "Category created successfully.",
      data: { id: newCategory._id.toString(), name: newCategory.name },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getCategories() {
  try {
    await dbConnect();

    const categories = await CategoryModel.find().lean();

    return {
      success: true,
      data: categories.map((category) => ({
        id: category._id.toString(),
        name: category.name,
      })),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function updateCategory(categoryId: string, name: string) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !isAdmin(session.user.role)) {
      throw new Error("Unauthorized: Only admins can update categories.");
    }

    const category = await CategoryModel.findByIdAndUpdate(
      categoryId,
      { name },
      { new: true }
    );

    if (!category) {
      return {
        success: false,
        error: "Category not found.",
      };
    }

    return {
      success: true,
      message: "Category updated successfully.",
      data: { id: category._id.toString(), name: category.name },
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function deleteCategory(categoryId: string) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user || !isAdmin(session.user.role)) {
      throw new Error("Unauthorized: Only admins can delete categories.");
    }

    const category = await CategoryModel.findByIdAndDelete(categoryId);

    if (!category) {
      return {
        success: false,
        error: "Category not found.",
      };
    }

    return {
      success: true,
      message: "Category deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getPopularCategories(limit: number = 5) {
  try {
    await dbConnect();

    const popularCategories = await JobVacancyModel.aggregate([
      { $unwind: "$categories" },
      {
        $group: {
          _id: "$categories",
          vacancyCount: { $sum: 1 },
        },
      },
      { $sort: { vacancyCount: -1 } },
      { $limit: limit },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "categoryDetails",
        },
      },
      { $unwind: "$categoryDetails" },
      {
        $project: {
          _id: 0,
          categoryId: "$_id",
          name: "$categoryDetails.name",
          vacancyCount: 1,
        },
      },
    ]);

    return {
      success: true,
      data: popularCategories,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
