import mongoose from "mongoose";
import { ICompanyExtended } from "./company";

export interface IJobVacancyCreate {
  title: string;
  description: string;
  requirements: string[];
  salaryRange: { min: number; max: number };
  city: string;
  company: mongoose.Types.ObjectId | string | ICompanyExtended;
  postedBy: mongoose.Types.ObjectId | string;
  isActive?: boolean;
}

export interface IJobVacancy extends IJobVacancyCreate {
  createdAt: Date;
}

export interface IJobVacancyExtended extends Omit<IJobVacancy, "_id"> {
  _id: string;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
}

export interface ICreateJobResponse {
  success: boolean;
  data?: IJobVacancy;
  error?: string;
}

export interface IGetJobVacancyResponse {
  success: boolean;
  data?: IJobVacancyExtended[];
  pagination?: IPagination;
  error?: string;
}

export interface IUpdateJobVacancyResponse {
  success: boolean;
  data?: IJobVacancyExtended;
  error?: string;
}

export interface IDeleteJobVacancyResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface IGetJobVacancyFullResponse {
  success: boolean;
  data?: IJobVacancyExtended;
  error?: string;
}
