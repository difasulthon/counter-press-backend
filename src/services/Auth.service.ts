import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { bodyRegisterNewUserSchema } from "../schemas/Auth.schema";
import { hashPassword } from "../utils/Password.util";

const prisma = new PrismaClient();

export async function registerUser(
  params: z.infer<typeof bodyRegisterNewUserSchema>
) {
  const { userName, email, password, fullName, address, city, phoneNumber } =
    params;

  const newUser = prisma.user.create({
    data: {
      fullName,
      userName,
      email,
      address,
      city,
      phoneNumber,
      password: {
        create: {
          hash: await hashPassword(password),
        },
      },
    },
    select: {
      fullName: true,
      userName: true,
      email: true,
      address: true,
      city: true,
      phoneNumber: true,
      password: false,
    },
  });

  return newUser;
}

export async function getValidUser(params: { userName: string }) {
  const { userName } = params;

  const user = prisma.user.findUnique({
    where: { userName },
    include: { password: { select: { hash: true } } },
  });

  return user;
}

export async function getUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      fullName: true,
      userName: true,
      email: true,
      address: true,
      city: true,
      phoneNumber: true,
    },
  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
}
