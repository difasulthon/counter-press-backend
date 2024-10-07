import { PrismaClient } from "@prisma/client";
import { z } from "zod";

import { queryUserSchema } from "../schemas/User.schema";

const prisma = new PrismaClient();

export async function getUsers(query: z.infer<typeof queryUserSchema>) {
  const { userName } = query;

  const users = await prisma.user.findMany({
    where: {
      userName: {
        contains: userName,
        mode: "insensitive",
      },
    },
  });

  return users;
}

export async function getUsersByUserName(userName: string) {
  const brand = await prisma.user.findFirst({
    where: {
      userName,
    },
  });

  return brand;
}
