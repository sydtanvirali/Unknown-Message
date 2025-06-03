import { Document } from "mongoose";

interface Message extends Document {
  content: string;
  createdAt: Date;
}
export default Message;
