import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: "job_seeker" | "employer" | "admin";
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["job_seeker", "employer", "admin"],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const UserModel =
  mongoose.models?.User || mongoose.model<IUser>("User", userSchema);
export default UserModel;
