"use server";

import { dbConnect } from "@/config/db";
import CompanyModel, { ICompany } from "@/models/Company";
import {
  ICompanyCreate,
  ICreateCompanyResponse,
  IGetCompanyResponse,
  IUpdateCompany,
  IUpdateCompanyResponse,
} from "@/types/company";

export async function createCompany(
  data: ICompanyCreate
): Promise<ICreateCompanyResponse> {
  try {
    await dbConnect();

    const newCompany = new CompanyModel(data);
    const savedCompany = await newCompany.save();

    return {
      success: true,
      data: {
        id: savedCompany._id.toString(),
        name: savedCompany.name,
        description: savedCompany.description,
        website: savedCompany.website,
        owner: savedCompany.owner.toString(),
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

export async function getCompanyById(
  companyId: string
): Promise<IGetCompanyResponse> {
  try {
    await dbConnect();
    const company = await CompanyModel.findById(companyId);

    if (!company) {
      return {
        success: false,
        error: "Company not found.",
      };
    }

    return {
      success: true,
      data: company,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function updateCompany(
  companyId: string,
  data: IUpdateCompany
): Promise<IUpdateCompanyResponse> {
  try {
    await dbConnect();
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
      companyId,
      data,
      { new: true }
    );
    if (!updatedCompany) {
      return {
        success: false,
        error: "Company not found.",
      };
    }
    return {
      success: true,
      data: updatedCompany,
    };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

export async function deleteCompany(companyId: string) {
  await dbConnect();
  return await CompanyModel.findByIdAndDelete(companyId);
}
