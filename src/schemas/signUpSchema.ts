import { z } from "zod";

export const usernameValidation = z
  .string()
  .min(5, "Username must be atleast 5 characters")
  .max(30, "Username must be no more than 30 characters")
  .regex(/ ^[a-zA-Z0-9_]+$/, "Username must not contain special character");

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be atleast 6 characters" }),
});
