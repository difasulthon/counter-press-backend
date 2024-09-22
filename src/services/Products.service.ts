import { z } from "zod";
import { PrismaClient, Product } from "@prisma/client";

// import { SORT, SORT_BY } from "../constants";
import { queryProductSchema } from "../schemas/Product.schema";

const prisma = new PrismaClient();

// const { ID } = SORT_BY;

export async function getProducts(query: z.infer<typeof queryProductSchema>) {
  const { name, brandId, sort } = query;

  // const sortBy = sortBy || ID;
  // const sortMethod = sort || SORT.ASC;
  // const orderBy = { [sortBy]: sortMethod };

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name || "",
        mode: "insensitive",
      },
      brandId,
    },
    // orderBy,
  });

  return products;
}

export async function getProductById(id: string) {
  const product = await prisma.product.findFirst({
    where: { id },
  });

  return product;
}

export async function addProduct(
  data: Omit<Product, "id" | "availableStock" | "createdAt" | "updatedAt">
) {
  const { name, price, image, brandId } = data;

  const newProduct = await prisma.product.create({
    data: {
      name,
      price: +price,
      image,
      brandId,
      availableStock: 0,
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

export async function updateProductById(data: Partial<Product>) {
  const { id, name, image, price, availableStock, brandId } = data;

  const updatedProduct = await prisma.product.update({
    where: { id },
    data: {
      name,
      price,
      image,
      availableStock,
      brandId,
    },
  });

  return updatedProduct;
}
