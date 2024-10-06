"use server";

import { dbConnect } from "@/config/db";
import CompanyModel, { ICompany } from "@/models/Company";

export async function createCompany(data: ICompany) {
  await dbConnect();
  const newCompany = new CompanyModel(data);
  return await newCompany.save();
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
