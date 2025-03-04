"use server";

import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { dbConnect } from "@/config/db";
import ApplicationModel from "@/models/Application";
import CompanyModel from "@/models/Company";
import JobVacancyModel from "@/models/JobVacancy";
import UserModel, { IUser } from "@/models/User";
import { ICreateUserResponse, IUserCreate } from "@/types/user";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

export async function createUser(
  data: IUserCreate
): Promise<ICreateUserResponse> {
  try {
    await dbConnect();

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const newUser = new UserModel({
      ...data,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    return {
      success: true,
      data: {
        id: savedUser._id.toString(),
        firstName: savedUser.firstName,
        lastName: savedUser.lastName,
        email: savedUser.email,
        role: savedUser.role,
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

export async function getUserById(userId: string) {
  await dbConnect();
  return await UserModel.findById(userId);
}

export async function updateUserProfile(updatedUser: Partial<IUser>) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const user = await UserModel.findByIdAndUpdate(
      session.user.id,
      { ...updatedUser },
      { new: true }
    ).lean();

    return {
      success: true,
      data: user,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
}
export async function deleteUserAccount() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const result = await UserModel.findByIdAndDelete(session.user.id);
    if (!result) {
      return { success: false, error: "Failed to delete user." };
    }

    return { success: true, message: "User deleted successfully." };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
}

export async function getUserDashboardData() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const user = await UserModel.findById(session.user.id).lean();
    if (!user) {
      throw new Error("User not found");
    }

    let company = null;
    let applications = [];

    if (user.role === "employer") {
      company = await CompanyModel.findOne({ owner: user._id }).lean();

      if (company && company.jobVacancies) {
        const jobVacanciesIds = company.jobVacancies.map((vacancy) =>
          vacancy._id.toString()
        );
        applications = await ApplicationModel.find({
          jobVacancy: { $in: jobVacanciesIds },
        })
          .populate({
            path: "jobVacancy",
            model: JobVacancyModel,
          })
          .populate("applicant")
          .lean();
      }
    } else {
      applications = await ApplicationModel.find({
        applicant: user._id,
      })
        .populate({
          path: "jobVacancy",
          model: JobVacancyModel,
        })
        .lean();
    }
    const plainData = {
      user: {
        ...user,
        _id: user._id.toString(),
        createdAt: user.createdAt.toISOString(),
      },
      company: company
        ? {
            ...company,
            _id: company._id.toString(),
            owner: company.owner.toString(),
            createdAt: company.createdAt.toISOString(),
          }
        : null,
      applications: applications.map((application) => ({
        ...application,
        _id: application._id.toString(),
        applicant: application.applicant
          ? {
              ...application.applicant,
              _id: application.applicant._id.toString(),
            }
          : null,
        jobVacancy: {
          ...application.jobVacancy,
          _id: application.jobVacancy._id.toString(),
          createdAt: application.jobVacancy.createdAt.toISOString(),
        },
        appliedAt: application.appliedAt.toISOString(),
      })),
    };

    return {
      success: true,
      data: plainData,
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}

export async function getUserDetails() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const user = await UserModel.findById(session.user.id).lean();
    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: {
        _id: user._id.toString(),
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        resumes: user.resumes
      },
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Unknown error occurred",
    };
  }
}

export async function saveResumeUrl(resumeUrl: string) {
  try {
    await dbConnect();

    console.log(resumeUrl);
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;

    console.log(userId);

    const user = await UserModel.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (!user.resumes) {
      user.resumes = [];
    }

    user.resumes.push({ url: resumeUrl, uploadedAt: new Date() });

    await user.save();

    return {
      success: true,
      message: "Resume URL saved successfully.",
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to save resume URL",
    };
  }
}

export async function getUserResumes() {
  try {
    await dbConnect();

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      throw new Error("User not authenticated");
    }

    const userId = session.user.id;
    const user = await UserModel.findById(userId).select("resumes").lean();
    if (!user || !user.resumes) {
      return {
        success: true,
        data: [],
      };
    }

    return {
      success: true,
      data: user.resumes,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || "Failed to retrieve resumes",
    };
  }
}
