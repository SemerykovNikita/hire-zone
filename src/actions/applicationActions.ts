"use server";

import { dbConnect } from "@/config/db";
import ApplicationModel, { IApplication } from "@/models/Application";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { IApplicationCreate } from "@/types/application";

export async function createApplication(data: IApplicationCreate) {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User is not authenticated");
    }

    const newApplication = new ApplicationModel({
      ...data,
      applicant: session.user.id,
    });

    await newApplication.save();

    return {
      success: true,
      message: "Application submitted successfully",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

export async function getApplicationById(applicationId: string) {
  await dbConnect();
  return await ApplicationModel.findById(applicationId);
}

export async function updateApplication(
  applicationId: string,
  data: Partial<Omit<IApplication, "applicant">>
) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User is not authenticated.");
  }

  const application = await ApplicationModel.findById(applicationId);
  if (application?.applicant.toString() !== session.user.id) {
    throw new Error("You are not authorized to update this application.");
  }

  return await ApplicationModel.findByIdAndUpdate(applicationId, data, {
    new: true,
  });
}

export async function deleteApplication(applicationId: string) {
  await dbConnect();

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    throw new Error("User is not authenticated.");
  }

  const application = await ApplicationModel.findById(applicationId);
  if (application?.applicant.toString() !== session.user.id) {
    throw new Error("You are not authorized to delete this application.");
  }

  return await ApplicationModel.findByIdAndDelete(applicationId);
}

export async function getApplicationsByJobVacancyId(vacancyId: string) {
  try {
    await dbConnect();

    const applications = await ApplicationModel.find({
      jobVacancy: vacancyId,
    })
      .populate("applicant", "firstName lastName email")
      .populate("jobVacancy", "title")
      .lean();

    if (!applications || applications.length === 0) {
      return {
        success: false,
        error: "No applications found for this job vacancy.",
      };
    }

    const plainApplications = applications.map((application) => ({
      ...application,
      _id: application._id.toString(),
      applicant: {
        ...application.applicant,
        _id: application.applicant._id.toString(),
      },
      jobVacancy: {
        ...application.jobVacancy,
        _id: application.jobVacancy._id.toString(),
      },
      appliedAt: application.appliedAt.toISOString(),
    }));

    return {
      success: true,
      data: plainApplications,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}
