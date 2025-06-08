import User from "@/types/User";
import mongoose, { Schema } from "mongoose";

const UserSchema: Schema<User> = new Schema({
  name: { type: String, required: true },
  email: {
    type: String,
    required: [true, "Email is required "],
    unique: true,
    match: [/.+\@.+\..+/, "Please use a valid email address"],
  },
  image: { type: String },
  provider: { type: String },
  providerId: { type: String },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
