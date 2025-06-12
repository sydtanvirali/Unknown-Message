import z from "zod";

export const acceptMessageSchema = z.object({
  topicId: z.string(),
  acceptMessages: z.boolean(),
});
