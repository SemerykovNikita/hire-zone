import mongoose, { Document } from "mongoose";
import MessageModel, { IMessage } from "./Message";

export interface IChat extends Document {
  employer: mongoose.Types.ObjectId;
  jobVacancy: mongoose.Types.ObjectId;
  messages: IMessage[];
  createdAt: Date;
}

const chatSchema = new mongoose.Schema<IChat>({
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  jobVacancy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "JobVacancy",
    required: true,
  },
  messages: {
    type: [MessageModel.schema],
    required: true,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const ChatModel =
  mongoose.models?.Chat || mongoose.model<IChat>("Chat", chatSchema);

export default ChatModel;
