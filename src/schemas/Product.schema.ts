import { z } from 'zod'

import {SORT, SORT_BY} from '../constants'

const {DESC, ASC} = SORT;
const {
  ID,
  NAME,
  BRAND_ID,
  CREATED_AT,
  UPDATED_AT
} = SORT_BY

const sortList = [DESC, ASC]
const sortByList = [ID, NAME, BRAND_ID, CREATED_AT, UPDATED_AT]

export const queryProductSchema = z.object({
  name: z.string().optional(),
  brand_id: z.string().optional(),
  sort: z.enum(sortList).optional(),
  sort_by: z.enum(sortByList).optional()
});

export const paramProductByIdSchema = z.object({
  id: z.string().min(1)
})

export const bodyAddProductSchema = z.object({
  name: z.string().min(3),
  brand_id: z.string().min(1),
  price: z.string().min(1),
  image: z.string().min(4)
})

export const bodyUpdateProductSchema = z.object({
  name: z.string().optional(),
  brand_id: z.string().optional(),
  price: z.string().optional(),
  image: z.string().optional(),
  available_stock: z.string().optional()
})