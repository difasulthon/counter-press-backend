import { z } from "zod";

import { SORT, SORT_BY } from "../constants";

const { DESC, ASC } = SORT;
const { ID, NAME, CREATED_AT, UPDATED_AT } = SORT_BY;

export const queryBrandSchema = z.object({
  name: z.string().optional(),
  sort: z.enum([DESC, ASC]).optional(),
  sortBy: z.enum([ID, NAME, CREATED_AT, UPDATED_AT]).optional(),
});

export const paramBrandByIdSchema = z.object({
  id: z.string().min(1),
});

export const bodyAddBrandSchema = z.object({
  name: z.string().min(3),
});

export const bodyUpdateBrandSchema = z.object({
  name: z.string().optional(),
});
