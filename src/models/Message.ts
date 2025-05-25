import mongoose, { Document } from "mongoose";

export interface IPart {
  type: "text";
  text: string;
}

export interface IMessage extends Document {
  id: string;
  createdAt: Date;
  role: "user" | "assistant";
  content: string;
  parts: IPart[];
  revisionId?: string | null;
  toolInvocations?: any[];
}

const partSchema = new mongoose.Schema<IPart>({
  type: {
    type: String,
    enum: ["text"],
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
});

const messageSchema = new mongoose.Schema<IMessage>({
  id: {
    type: String,
    required: true,
    unique: true,
    default: () => new mongoose.Types.ObjectId().toHexString(),
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  role: {
    type: String,
    enum: ["user", "assistant"],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  parts: {
    type: [partSchema],
    required: true,
  },
  revisionId: {
    type: String,
    default: null,
  },
  toolInvocations: {
    type: Array,
    default: [],
  },
});

const MessageModel =
  mongoose.models?.Message ||
  mongoose.model<IMessage>("Message", messageSchema);

export default MessageModel;
