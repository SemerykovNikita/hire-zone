import { IApplication } from "@/models/Application";
import mongoose from "mongoose";

export interface IApplicationExtended extends Omit<IApplication, "_id"> {
  _id: string;
}

export interface ICreateApplicationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface IGetApplicationResponse {
  success: boolean;
  data?: IApplicationExtended;
  error?: string;
}

export interface IUpdateApplicationResponse {
  success: boolean;
  data?: IApplicationExtended;
  error?: string;
}

export interface IDeleteApplicationResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface IApplicationCreate {
  jobVacancy: mongoose.Types.ObjectId | string;
  coverLetter?: string;
  resumeUrl: string;
}
