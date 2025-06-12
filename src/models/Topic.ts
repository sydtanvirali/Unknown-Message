import mongoose, { Schema } from "mongoose";

const TopicSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, required: true },
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  createdAt: { type: Date, default: Date.now },
});

const TopicModel =
  mongoose.models.Topic || mongoose.model("Topic", TopicSchema);

export default TopicModel;
