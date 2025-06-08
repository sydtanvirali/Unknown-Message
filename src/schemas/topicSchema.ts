import z from "zod";

export const topicSchema = z.object({
  title: z.string(),
  description: z
    .string()
    .min(10, { message: "Content must be at least 10 characters" }),
});
