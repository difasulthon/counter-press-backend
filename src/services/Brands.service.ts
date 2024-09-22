import { PrismaClient, Brand } from "@prisma/client";
import { z } from "zod";

import { queryBrandSchema } from "../schemas/Brand.schema";
import { SORT, SORT_BY } from "../constants";
import { formatSlug } from "../utils/formatter";

const prisma = new PrismaClient();

const { ID } = SORT_BY;

export async function getBrands(query: z.infer<typeof queryBrandSchema>) {
  const { name, sortBy, sort } = query;

  const sortByKey = sortBy || ID;
  const sortMethod = sort || SORT.ASC;
  const orderBy = { [sortByKey]: sortMethod };

  const brands = await prisma.brand.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
    },
    orderBy,
  });

  return brands;
}

export async function getBrandById(id: string) {
  const brand = await prisma.brand.findFirst({
    where: {
      id,
    },
  });

  return brand;
}

export async function addBrands(data: Pick<Brand, "name">) {
  const { name } = data;

  const newBrand = prisma.brand.create({
    data: {
      name,
      slug: formatSlug(name),
    },
  });

  return newBrand;
}

export async function deleteBrandById(id: string) {
  const deletedBrand = await prisma.brand.delete({
    where: {
      id,
    },
  });

  return deletedBrand;
}

export async function updateBrandById(data: Partial<Brand>) {
  const { id, name } = data;

  const updatedBrand = await prisma.brand.update({
    where: {
      id,
    },
    data: {
      name,
    },
  });

  return updatedBrand;
}
