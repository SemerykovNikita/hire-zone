import mongoose, { Document } from "mongoose";

export interface IApplication extends Document {
  applicant: mongoose.Schema.Types.ObjectId;
  jobVacancy: mongoose.Schema.Types.ObjectId;
  coverLetter?: string;
  resumeUrl: string;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Date;
}

const applicationSchema = new mongoose.Schema<IApplication>({
  applicant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobVacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobVacancy",
    required: true,
  },
  coverLetter: { type: String },
  resumeUrl: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "accepted", "rejected"],
    default: "pending",
  },
  appliedAt: { type: Date, default: Date.now },
});

const ApplicationModel =
  mongoose.models?.Application ||
  mongoose.model<IApplication>("Application", applicationSchema);
export default ApplicationModel;
