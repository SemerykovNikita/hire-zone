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
