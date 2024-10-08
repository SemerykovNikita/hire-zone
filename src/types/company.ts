import { ICompany } from "@/models/Company";
import mongoose from "mongoose";

export interface ICompanyCreate {
  name: string;
  description?: string;
  website?: string;
  owner: mongoose.Types.ObjectId;
}

export interface ICreateCompanyResponse {
  success: boolean;
  data?: {
    id: string;
    name: string;
    description?: string;
    website?: string;
    owner: string;
  };
  error?: string;
}

export interface IUpdateCompany {
  name?: string;
  description?: string;
  website?: string;
}

export interface IUpdateCompanyResponse {
  success: boolean;
  data?: ICompany;
  error?: string;
}

export interface IGetCompanyResponse {
  success: boolean;
  data?: ICompany;
  error?: string;
}
