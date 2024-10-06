import mongoose, { Document } from "mongoose";

export interface IJobVacancy extends Document {
  title: string;
  description: string;
  requirements: string[];
  salaryRange?: { min: number; max: number };
  company: mongoose.Schema.Types.ObjectId;
  postedBy: mongoose.Schema.Types.ObjectId;
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
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const JobVacancyModel =
  mongoose.models?.JobVacancy ||
  mongoose.model<IJobVacancy>("JobVacancy", jobVacancySchema);
export default JobVacancyModel;
