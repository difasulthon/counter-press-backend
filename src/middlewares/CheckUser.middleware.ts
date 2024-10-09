import { createMiddleware } from "hono/factory";
import { getCookie } from "hono/cookie";
import { PrismaClient } from "@prisma/client";

import { validateToken } from "../utils/Token.util";

const prisma = new PrismaClient();

type Env = {
  Variables: {
    user: {
      id: string;
    };
  };
};

export const checkUserToken = () =>
  createMiddleware<Env>(async (c, next) => {
    const authHeader = c.req.header("Authorization");
    if (!authHeader) {
      return c.json(
        {
          status: "error",
          message: "Unauthorized. Authorization header is required",
        },
        401
      );
    }

    const tokenCookie = getCookie(c, "token");

    const token = tokenCookie
      ? tokenCookie
      : authHeader
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return c.json(
        {
          status: "error",
          message: "Unauthorized. Token is required",
        },
        401
      );
    }

    const decodedToken = await validateToken(token);
    if (!decodedToken) {
      return c.json(
        {
          status: "error",
          message: "Unauthorized. Token is invalid",
        },
        401
      );
    }

    const userId = decodedToken.subject;
    if (!userId) {
      return c.json(
        {
          status: "error",
          message: "Unauthorized. User ID doen't exist",
        },
        401
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        fullName: true,
        userName: true,
        address: true,
        city: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      return c.json(
        {
          status: "error",
          message: "User not found",
        },
        404
      );
    }

    c.set("user", user);

    await next();
  });
