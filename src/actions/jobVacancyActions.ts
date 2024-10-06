"use server";

import { dbConnect } from "@/config/db";
import JobVacancyModel, { IJobVacancy } from "@/models/JobVacancy";

export async function createJobVacancy(data: IJobVacancy) {
  await dbConnect();
  const newJobVacancy = new JobVacancyModel(data);
  return await newJobVacancy.save();
}

export async function getJobVacancyById(vacancyId: string) {
  await dbConnect();
  return await JobVacancyModel.findById(vacancyId);
}

export async function updateJobVacancy(
  vacancyId: string,
  data: Partial<IJobVacancy>
) {
  await dbConnect();
  return await JobVacancyModel.findByIdAndUpdate(vacancyId, data, {
    new: true,
  });
}

export async function deleteJobVacancy(vacancyId: string) {
  await dbConnect();
  return await JobVacancyModel.findByIdAndDelete(vacancyId);
}
