import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getCarts = async (userId: string) => {
  const existingCart = await prisma.cart.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      items: {
        include: {
          product: true,
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!existingCart) {
    const newCart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
    return newCart;
  }

  return existingCart;
};

export const addCartItem = async (userId: string, productId: string) => {
  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if (!product) {
    throw new Error("Product does not available");
  }

  const existingCart = await getCarts(userId);

  const existingItem = await prisma.cartItem.findFirst({
    where: {
      cartId: existingCart.id,
      productId: productId,
    },
  });

  if (existingItem) {
    const updatedItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: {
        quantity: {
          increment: 1,
        },
      },
    });

    return updatedItem;
  } else {
    const newItem = await prisma.cartItem.create({
      data: {
        productId: productId,
        quantity: 1,
        cartId: existingCart.id,
      },
    });

    return newItem;
  }
};

export const updateItem = async (itemId: string, quantity: number) => {
  const existingItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { product: true },
  });

  if (!existingItem) {
    throw new Error(`Cart item not available.`);
  }

  if (!existingItem.product) {
    throw new Error(`Product associated with cart item not available.`);
  }

  const updatedItem = await prisma.cartItem.update({
    where: { id: itemId },
    data: { quantity: quantity },
  });

  return updatedItem;
};

export const deleteItem = async (itemId: string) => {
  const existingItem = await prisma.cartItem.findUnique({
    where: { id: itemId },
  });

  if (!existingItem) {
    throw new Error("Cart item not available.");
  }

  await prisma.cartItem.delete({
    where: { id: itemId },
  });

  return { message: "Success delete item." };
};
