interface Topic {
  _id?: string;
  userId?: string;
  title: string;
  description: string;
  isAcceptingMessages?: boolean;
  createdAt?: Date;
}
export default Topic;
