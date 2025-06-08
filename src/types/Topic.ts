import { Document, Types } from "mongoose";

interface Topic extends Document {
  userId: Types.ObjectId | string;
  title: string;
  description: string;
  createdAt: Date;
}
export default Topic;
