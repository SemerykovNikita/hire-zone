"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/config/db";
import CompanyModel from "@/models/Company";
import JobVacancyModel, { IJobVacancy } from "@/models/JobVacancy";
import {
  IJobVacancyCreate,
  ICreateJobResponse,
  IGetJobVacancyResponse,
  IUpdateJobVacancyResponse,
  IDeleteJobVacancyResponse,
  IGetJobVacancyFullResponse,
} from "@/types/job";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";

export async function createJobVacancy(
  data: IJobVacancyCreate
): Promise<ICreateJobResponse> {
  try {
    await dbConnect();

    const newJobVacancy = new JobVacancyModel(data);
    const savedJobVacancy = await newJobVacancy.save();
    const plainJobVacancyData = savedJobVacancy.toObject();

    plainJobVacancyData._id = plainJobVacancyData._id.toString();
    plainJobVacancyData.company = plainJobVacancyData.company.toString();
    plainJobVacancyData.postedBy = plainJobVacancyData.postedBy.toString();

    return {
      success: true,
      data: plainJobVacancyData,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function getJobVacancyById(
  vacancyId: string
): Promise<IGetJobVacancyFullResponse> {
  try {
    await dbConnect();

    const jobVacancy = await JobVacancyModel.findById(vacancyId)
      .populate("company")
      .exec();

    if (!jobVacancy || !jobVacancy.company) {
      return {
        success: false,
        error: "Job vacancy or company not found.",
      };
    }

    const plainJobVacancy = {
      ...jobVacancy.toObject(),
      _id: jobVacancy._id.toString(),
      company: {
        ...jobVacancy.company.toObject(),
        _id: jobVacancy.company._id.toString(),
        owner: jobVacancy.company.owner.toString(),
        createdAt: jobVacancy.company.createdAt.toISOString(),
      },
      postedBy: jobVacancy.postedBy.toString(),
      createdAt: jobVacancy.createdAt.toISOString(),
    };

    return {
      success: true,
      data: plainJobVacancy,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function toggleJobVacancyStatus(vacancyId: string) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { success: false, error: "User not authenticated" };
    }

    const jobVacancy = await JobVacancyModel.findById(vacancyId);

    if (!jobVacancy) {
      return { success: false, error: "Job vacancy not found." };
    }

    if (jobVacancy.postedBy.toString() !== session.user.id) {
      return {
        success: false,
        error: "You are not authorized to modify this job vacancy.",
      };
    }

    jobVacancy.isActive = !jobVacancy.isActive;
    const updatedJobVacancy = await jobVacancy.save();

    const plainJobVacancy = updatedJobVacancy.toObject();
    plainJobVacancy._id = plainJobVacancy._id.toString();
    plainJobVacancy.company = plainJobVacancy.company.toString();
    plainJobVacancy.postedBy = plainJobVacancy.postedBy.toString();
    plainJobVacancy.createdAt = plainJobVacancy.createdAt.toISOString();

    return { success: true, data: plainJobVacancy };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function updateJobVacancy(
  vacancyId: string,
  data: Partial<IJobVacancyCreate>
): Promise<IUpdateJobVacancyResponse> {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    const jobVacancy = await JobVacancyModel.findById(vacancyId)
      .populate("company")
      .lean();

    if (!jobVacancy) {
      return {
        success: false,
        error: "Job vacancy not found.",
      };
    }

    if (
      jobVacancy.postedBy.toString() !== userId &&
      jobVacancy.company.owner.toString() !== userId
    ) {
      return {
        success: false,
        error: "You do not have permission to update this job vacancy.",
      };
    }

    const updatedJobVacancy = await JobVacancyModel.findByIdAndUpdate(
      vacancyId,
      data,
      { new: true }
    );

    if (!updatedJobVacancy) {
      return {
        success: false,
        error: "Failed to update job vacancy.",
      };
    }

    const plainUpdatedVacancy = {
      ...updatedJobVacancy.toObject(),
      _id: updatedJobVacancy._id.toString(),
      company: updatedJobVacancy.company.toString(),
      postedBy: updatedJobVacancy.postedBy.toString(),
      createdAt: updatedJobVacancy.createdAt.toISOString(),
    };

    return {
      success: true,
      data: plainUpdatedVacancy,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function getJobVacanciesByCompanyId(
  companyId: string
): Promise<IGetJobVacancyResponse> {
  try {
    await dbConnect();

    const jobVacancies = await JobVacancyModel.find({
      company: companyId,
    }).lean<IJobVacancy[]>();

    if (!jobVacancies || jobVacancies.length === 0) {
      return {
        success: false,
        error: "No job vacancies found for this company.",
      };
    }

    const plainJobVacancies = jobVacancies.map((vacancy) => ({
      ...vacancy,
      _id: (vacancy._id as mongoose.Types.ObjectId).toString(),
      company: (
        vacancy.company as unknown as mongoose.Types.ObjectId
      ).toString(),
      postedBy: (
        vacancy.postedBy as unknown as mongoose.Types.ObjectId
      ).toString(),
      createdAt: vacancy.createdAt.toISOString(),
    }));

    return {
      success: true,
      data: plainJobVacancies,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteJobVacancy(vacancyId: string) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return { success: false, error: "User not authenticated" };
    }

    const jobVacancy = await JobVacancyModel.findById(vacancyId);

    if (!jobVacancy) {
      return { success: false, error: "Job vacancy not found." };
    }

    if (jobVacancy.postedBy.toString() !== session.user.id) {
      return {
        success: false,
        error: "You are not authorized to delete this job vacancy.",
      };
    }

    await jobVacancy.deleteOne();

    return { success: true, message: "Job vacancy deleted successfully." };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function getJobVacanciesBySearch(
  title: string | null,
  city: string | null,
  page: number = 1,
  limit: number = 10
): Promise<IGetJobVacancyResponse> {
  try {
    await dbConnect();

    const query: any = {};

    if (city) {
      query.city = city;
    }

    if (title) {
      const companies = await CompanyModel.find({
        name: { $regex: title, $options: "i" },
      }).lean();

      const companyIds = companies.map((company) => company._id.toString());

      query.$or = [
        { title: { $regex: title, $options: "i" } },
        { description: { $regex: title, $options: "i" } },
        { company: { $in: companyIds } },
        { requirements: { $regex: title, $options: "i" } },
      ];
    }

    const total = await JobVacancyModel.countDocuments(query);
    const jobVacancies = await JobVacancyModel.find(query)
      .populate("company")
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    if (!jobVacancies || jobVacancies.length === 0) {
      return {
        success: false,
        error: "No job vacancies found.",
      };
    }

    const plainJobVacancies = jobVacancies.map((vacancy) => ({
      ...vacancy,
      _id: (vacancy._id as mongoose.Types.ObjectId).toString(),
      company: vacancy.company ? vacancy.company.name : null,
      postedBy: (vacancy.postedBy as mongoose.Types.ObjectId).toString(),
      createdAt: vacancy.createdAt.toISOString(),
      title: vacancy.title,
      description: vacancy.description,
      requirements: vacancy.requirements,
      salaryRange: vacancy.salaryRange,
    }));

    return {
      success: true,
      data: plainJobVacancies,
      pagination: {
        total,
        page,
        limit,
      },
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
