interface Message {
  _id?: string;
  topicId: string;
  content: string;
  createdAt?: Date;
}
export default Message;
