import mongoose, { Document } from "mongoose";

export interface IJobVacancy extends Document {
  title: string;
  description: string;
  requirements: string[];
  salaryRange?: { min: number; max: number };
  company: mongoose.Schema.Types.ObjectId;
  city: string;
  postedBy: mongoose.Schema.Types.ObjectId;
  categories?: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
  isActive: boolean;
}

const jobVacancySchema = new mongoose.Schema<IJobVacancy>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  requirements: { type: [String], required: true },
  salaryRange: {
    min: { type: Number },
    max: { type: Number },
  },
  city: { type: String, required: true },
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Company",
    required: true,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const JobVacancyModel =
  mongoose.models?.JobVacancy ||
  mongoose.model<IJobVacancy>("JobVacancy", jobVacancySchema);
export default JobVacancyModel;
