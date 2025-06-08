import z from "zod";

export const messageSchema = z.object({
  topicId: z.string(),
  content: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" })
    .max(300, { message: "Content must be no longer than 300 characters" }),
});
