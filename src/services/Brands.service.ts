import { PrismaClient, Brand } from "@prisma/client";

import { brandSchema } from "../schemas/Brand.schema";
import { SORT, SORT_BY } from "../constants";

const prisma = new PrismaClient()

const {ID} = SORT_BY

export async function getBrands(query: typeof brandSchema): Brand[] {
  const {name, sort_by, sort} = query

  const sortBy = sort_by || ID
  const sortMethod = sort || SORT.ASC
  const orderBy = { [sortBy]: sortMethod }

  const brands = await prisma.brand.findMany({
    where: {
      name: {
        contains: name || '',
        mode: 'insensitive'
      }
    },
    orderBy
  })

  return brands;
}

export async function getBrandById(id: string): Brand {
  const brand = await prisma.brand.findFirst({
    where: {
      id: +id
    }
  })

  return brand
}

export async function addBrands(data: Partial<Brand>) {
  const {name} = data;

  const newBrand = prisma.brand.create({
    data: {
      name
    }
  })

  return newBrand
}

export async function deleteBrandById(id: string) {
  const deletedBrand = await prisma.brand.delete({
    where: {
      id: +id
    }
  })

  return deletedBrand
}

export async function updateBrandById(data: Partial<Brand>) {
  const {
    id,
    name,
  } = data

  const updatedBrand = await prisma.brand.update({
    where: {
      id: +id
    },
    data: {
      name: name || undefined,
    }
  })

  return updatedBrand
}