import { Document } from "mongoose";
import Message from "./Message";

interface User extends Document {
  name: string;
  email: string;
  image: string;
  provider: string;
  providerId: string;
  isAcceptingMessage: boolean;
}

export default User;
