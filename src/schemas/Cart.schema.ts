import { z } from "zod";

export const bodyAddCartItemSchema = z.object({
  productId: z.string(),
});

export const paramCartItemSchema = z.object({
  id: z.string(),
});

export const bodyUpdateCartItemSchema = z.object({
  quantity: z.number(),
});
