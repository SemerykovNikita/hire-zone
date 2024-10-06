import mongoose, { Document } from "mongoose";

export interface ICompany extends Document {
  name: string;
  description?: string;
  website?: string;
  owner: mongoose.Schema.Types.ObjectId;
  createdAt: Date;
}

const companySchema = new mongoose.Schema<ICompany>({
  name: { type: String, required: true },
  description: { type: String },
  website: { type: String },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const CompanyModel =
  mongoose.models?.Company ||
  mongoose.model<ICompany>("Company", companySchema);
export default CompanyModel;
