import { PrismaClient, Product } from "@prisma/client";
import { z } from "zod";

import { SORT, SORT_BY } from "../constants";
import {
  bodyUpdateProductSchema,
  queryProductSchema,
} from "../schemas/Product.schema";
import { formatSlug } from "../utils/formatter";

const prisma = new PrismaClient();

const { ID } = SORT_BY;

export async function getProducts(query: z.infer<typeof queryProductSchema>) {
  const { name, brandId, sort, sortBy } = query;

  const sortByKey = sortBy || ID;
  const sortMethod = sort || SORT.ASC;
  const orderBy = { [sortByKey]: sortMethod };

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name,
        mode: "insensitive",
      },
      brandId,
    },
    orderBy,
  });

  return products;
}

export async function getProductBySlug(slug: string) {
  console.log("slug", slug);
  const product = await prisma.product.findFirst({
    where: {
      slug,
    },
  });
  console.log("product", product);

  return product;
}

export async function addProduct(
  data: Pick<
    Product,
    "name" | "price" | "image" | "brandId" | "stock" | "brandName"
  >
) {
  const { name, price, brandId, image, stock, brandName } = data;

  const newProduct = await prisma.product.create({
    data: {
      name,
      price,
      image,
      brandId,
      brandName,
      stock,
      slug: formatSlug(name),
    },
  });

  return newProduct;
}

export async function deleteProductById(id: string) {
  const deletedProduct = await prisma.product.delete({
    where: {
      id,
    },
  });

  return deletedProduct;
}

export async function updateProductBySlug(
  slug: string,
  data: z.infer<typeof bodyUpdateProductSchema>
) {
  const { name, image, price, stock, brandId, brandName } = data;

  const slugValue = name ? formatSlug(name) : undefined;

  const updatedProduct = await prisma.product.update({
    where: {
      slug,
    },
    data: {
      slug: slugValue,
      name,
      price,
      image,
      stock,
      brandId,
      brandName,
    },
  });

  return updatedProduct;
}
