import Message from "@/types/Message";
import mongoose, { Schema } from "mongoose";

const MessageSchema: Schema<Message> = new Schema({
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const MessageModel =
  (mongoose.models.Message as mongoose.Model<Message>) ||
  mongoose.model<Message>("Message", MessageSchema);

export { MessageModel, MessageSchema };
