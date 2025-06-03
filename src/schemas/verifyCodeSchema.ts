import z from "zod";

export const verifyCodeSchema = z.object({
  code: z.string().length(6, "Verify code must be 6 digits"),
});
