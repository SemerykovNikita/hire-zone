import mongoose, { Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  role: "job_seeker" | "employer" | "admin";
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
  username: { type: String, required: true, unique: true },
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
