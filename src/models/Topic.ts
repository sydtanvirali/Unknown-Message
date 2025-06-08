import Topic from "@/types/Topic";
import mongoose, { Schema } from "mongoose";

const TopicSchema: Schema<Topic> = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TopicModel =
  (mongoose.models.Topic as mongoose.Model<Topic>) ||
  mongoose.model<Topic>("Topic", TopicSchema);

export default TopicModel;
