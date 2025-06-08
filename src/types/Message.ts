import { Document, Types } from "mongoose";

interface Message extends Document {
  topicId: Types.ObjectId | string;
  content: string;
  createdAt: Date;
}
export default Message;
