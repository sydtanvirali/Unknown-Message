import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
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
});

const UserModel = mongoose.models.User || mongoose.model("User", UserSchema);

export default UserModel;
