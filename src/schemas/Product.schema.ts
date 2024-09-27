import { z } from "zod";

import { SORT, SORT_BY } from "../constants";

const { DESC, ASC } = SORT;
const { ID, NAME, BRAND_ID, CREATED_AT, UPDATED_AT } = SORT_BY;

export const queryProductSchema = z.object({
  name: z.string().optional(),
  brandId: z.string().optional(),
  sort: z.enum([DESC, ASC]).optional(),
  sortBy: z.enum([ID, NAME, BRAND_ID, CREATED_AT, UPDATED_AT]).optional(),
});

export const paramProductByIdSchema = z.object({
  id: z.string().min(1),
});

export const paramProductBySlugSchema = z.object({
  slug: z.string().min(1),
});

export const bodyAddProductSchema = z.object({
  name: z.string().min(3),
  brandId: z.string().min(1),
  price: z.number().min(1),
  image: z.string().min(4),
  stock: z.number().min(1),
  brandName: z.string().min(1),
});

export const bodyUpdateProductSchema = z.object({
  name: z.string().optional(),
  price: z.number().optional(),
  image: z.string().optional(),
  stock: z.number().optional(),
  brandId: z.string().optional(),
  brandName: z.string().optional(),
});
