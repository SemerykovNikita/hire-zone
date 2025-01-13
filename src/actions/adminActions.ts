"use server";

import { dbConnect } from "@/config/db";
import UserModel from "@/models/User";
import JobVacancyModel from "@/models/JobVacancy";
import ApplicationModel from "@/models/Application";
import CompanyModel from "@/models/Company";

export async function getAdminStatistics() {
  try {
    await dbConnect();

    const [userCount, jobVacancyCount, applicationCount, companyCount] =
      await Promise.all([
        UserModel.countDocuments(),
        JobVacancyModel.countDocuments(),
        ApplicationModel.countDocuments(),
        CompanyModel.countDocuments(),
      ]);

    const newUsersByDay = await UserModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const applicationsByDay = await ApplicationModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$appliedAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const jobVacanciesByDay = await JobVacancyModel.aggregate([
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    return {
      success: true,
      data: {
        counts: {
          userCount,
          jobVacancyCount,
          applicationCount,
          companyCount,
        },
        trends: {
          newUsersByDay,
          applicationsByDay,
          jobVacanciesByDay,
        },
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}

export async function deleteUser(userId: string) {
  try {
    await dbConnect();
    const result = await UserModel.findByIdAndDelete(userId);

    if (!result) {
      return { success: false, error: "User not found." };
    }

    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}

export async function deleteCompany(companyId: string) {
  try {
    await dbConnect();

    const company = await CompanyModel.findById(companyId);

    if (!company) {
      return { success: false, error: "Company not found." };
    }

    await Promise.all([
      JobVacancyModel.deleteMany({ company: company._id }),
      CompanyModel.findByIdAndDelete(company._id),
    ]);

    return {
      success: true,
      message: "Company and its vacancies deleted successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}

export async function deleteJobVacancy(vacancyId: string) {
  try {
    await dbConnect();

    const jobVacancy = await JobVacancyModel.findById(vacancyId);

    if (!jobVacancy) {
      return { success: false, error: "Job vacancy not found." };
    }

    await jobVacancy.deleteOne();

    return { success: true, message: "Job vacancy deleted successfully." };
  } catch (error) {
    return {
      success: false,
      error: error.message || "An unknown error occurred",
    };
  }
}
