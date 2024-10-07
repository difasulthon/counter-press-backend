import { z } from "zod";

export const bodyRegisterNewUserSchema = z.object({
  fullName: z.string().min(1),
  userName: z.string().min(3),
  email: z.string().email(),
  password: z.string(),
  address: z.string().optional(),
  city: z.string().optional(),
  phoneNumber: z.string().optional(),
});

export const bodyLoginSchema = z.object({
  userName: z.string(),
  password: z.string(),
});
