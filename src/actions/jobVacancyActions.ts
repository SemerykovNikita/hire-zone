"use server";

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

export async function updateJobVacancy(
  vacancyId: string,
  data: Partial<IJobVacancyCreate>
): Promise<IUpdateJobVacancyResponse> {
  try {
    await dbConnect();
    const updatedJobVacancy = await JobVacancyModel.findByIdAndUpdate(
      vacancyId,
      data,
      { new: true }
    );

    if (!updatedJobVacancy) {
      return {
        success: false,
        error: "Job vacancy not found.",
      };
    }

    return {
      success: true,
      data: updatedJobVacancy,
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

export async function deleteJobVacancy(
  vacancyId: string
): Promise<IDeleteJobVacancyResponse> {
  try {
    await dbConnect();
    const deletedJobVacancy = await JobVacancyModel.findByIdAndDelete(
      vacancyId
    );

    if (!deletedJobVacancy) {
      return {
        success: false,
        error: "Job vacancy not found.",
      };
    }

    return {
      success: true,
      message: "Job vacancy deleted successfully.",
    };
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
  city: string | null
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

    const jobVacancies = await JobVacancyModel.find(query)
      .populate("company")
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
      company: {
        ...vacancy.company,
        _id: (vacancy.company._id as mongoose.Types.ObjectId).toString(),
      },
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
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
