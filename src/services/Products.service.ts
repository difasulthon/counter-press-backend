import { PrismaClient, Product } from '@prisma/client'

import { SORT, SORT_BY } from '../constants';
import { productSchema } from '../schemas/Product.schema';

const prisma = new PrismaClient()

const {ID} = SORT_BY

export async function getProducts(query: typeof productSchema): Product[] {
  const {name, brand_id, sort, sort_by} = query

  const sortBy = sort_by || ID
  const sortMethod = sort || SORT.ASC
  const orderBy = { [sortBy]: sortMethod }

  const products = await prisma.product.findMany({
    where: {
      name: {
        contains: name || '',
        mode: 'insensitive'
      },
      brand_id: brand_id ? +brand_id : undefined,
    },
    orderBy
  })

  return products;
}

export async function getProductById(id: string): Product {
  const product = await prisma.product.findFirst({
    where: {
      id: +id
    }
  })

  return product
}

export async function addProduct(data: Partial<Product>) {
  const {name, price, brand_id, image} = data;

  const newProduct = await prisma.product.create({
    data: {
      name,
      price: +price,
      image,
      brand_id: +brand_id,
      available_stock: 0
    }
  })

  return newProduct
}

export async function deleteProductById(id: string) {
  const deletedProduct = await prisma.product.delete({
    where: {
      id: +id
    }
  })

  return deletedProduct
}

export async function updateProductById(data: Partial<Product>) {
  const {
    id,
    name,
    image,
    price,
    available_stock,
    brand_id
  } = data

  const updatedProduct = await prisma.product.update({
    where: {
      id: +id
    },
    data: {
      name: name || undefined,
      price: price ? +price : undefined,
      image: image || undefined,
      available_stock: available_stock ? +available_stock : undefined,
      brand_id: brand_id ? +brand_id : undefined
    }
  })

  return updatedProduct
}