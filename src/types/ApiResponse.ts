import Message from "./Message";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: object;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}
