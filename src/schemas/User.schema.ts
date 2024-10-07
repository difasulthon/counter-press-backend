import { z } from "zod";

export const queryUserSchema = z.object({
  userName: z.string().optional(),
});

export const paramUserByUserNameSchema = z.object({
  userName: z.string().min(1),
});
