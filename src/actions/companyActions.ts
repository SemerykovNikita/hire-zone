"use server";

import { dbConnect } from "@/config/db";
import CompanyModel, { ICompany } from "@/models/Company";
import { ICompanyCreate, ICreateCompanyResponse } from "@/types/company";

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

export async function getCompanyById(companyId: string) {
  await dbConnect();
  return await CompanyModel.findById(companyId);
}

export async function updateCompany(
  companyId: string,
  data: Partial<ICompany>
) {
  await dbConnect();
  return await CompanyModel.findByIdAndUpdate(companyId, data, { new: true });
}

export async function deleteCompany(companyId: string) {
  await dbConnect();
  return await CompanyModel.findByIdAndDelete(companyId);
}
