"use server";

import { dbConnect } from "@/config/db";
import ApplicationModel, { IApplication } from "@/models/Application";

export async function createApplication(data: IApplication) {
  await dbConnect();
  const newApplication = new ApplicationModel(data);
  return await newApplication.save();
}

export async function getApplicationById(applicationId: string) {
  await dbConnect();
  return await ApplicationModel.findById(applicationId);
}

export async function updateApplication(
  applicationId: string,
  data: Partial<IApplication>
) {
  await dbConnect();
  return await ApplicationModel.findByIdAndUpdate(applicationId, data, {
    new: true,
  });
}

export async function deleteApplication(applicationId: string) {
  await dbConnect();
  return await ApplicationModel.findByIdAndDelete(applicationId);
}
