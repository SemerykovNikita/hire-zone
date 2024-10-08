"use server";

import { dbConnect } from "@/config/db";
import JobVacancyModel from "@/models/JobVacancy";
import {
  IJobVacancyCreate,
  ICreateJobResponse,
  IGetJobVacancyResponse,
  IUpdateJobVacancyResponse,
  IDeleteJobVacancyResponse,
} from "@/types/job";

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
): Promise<IGetJobVacancyResponse> {
  try {
    await dbConnect();
    const jobVacancy = await JobVacancyModel.findById(vacancyId);

    if (!jobVacancy) {
      return {
        success: false,
        error: "Job vacancy not found.",
      };
    }

    return {
      success: true,
      data: jobVacancy,
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
