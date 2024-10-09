import { OpenAPIHono } from "@hono/zod-openapi";
import { setCookie } from "hono/cookie";

import { TAGS } from "../constants";
import { checkUserToken } from "../middlewares/CheckUser.middleware";
import {
  bodyLoginSchema,
  bodyRegisterNewUserSchema,
} from "../schemas/Auth.schema";
import { getUser, getValidUser, registerUser } from "../services/Auth.service";
import { verifyPassword } from "../utils/Password.util";
import { createToken } from "../utils/Token.util";

const auth = new OpenAPIHono();

/**
 * POST Add New User
 */
auth.openapi(
  {
    method: "post",
    path: "/auth/register",
    description: "Register a new user",
    request: {
      body: {
        content: {
          "application/json": {
            schema: bodyRegisterNewUserSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Add new user",
      },
    },
    tags: TAGS.AUTH,
  },
  async (c) => {
    const body = c.req.valid("json");

    const { fullName, userName, email, password, address, city, phoneNumber } =
      body;
    const newUser = await registerUser({
      fullName,
      userName,
      email,
      password,
      address,
      city,
      phoneNumber,
    });

    return c.json(
      {
        status: true,
        message: "Successfully register a new user",
        data: newUser,
      },
      201
    );
  }
);

/**
 * POST Login
 */
auth.openapi(
  {
    method: "post",
    path: "/auth/login",
    description: "Login",
    request: {
      body: {
        content: {
          "application/json": {
            schema: bodyLoginSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Login",
      },
    },
    tags: TAGS.AUTH,
  },
  async (c) => {
    const body = c.req.valid("json");

    const { userName, password } = body;
    const user = await getValidUser({ userName });

    if (!user) {
      return c.json({ message: "User not found" }, 400);
    }

    if (!user?.password?.hash) {
      return c.json({ message: "User doesn't have a password" }, 400);
    }

    const validPassword = await verifyPassword(user.password.hash, password);

    if (!validPassword) {
      return c.json({ message: "Password incorrect" }, 400);
    }

    const token = await createToken(user.id);

    if (!token) {
      return c.json({ message: "Authentication failed to process" }, 400);
    }

    setCookie(c, "token", token);

    return c.json(
      {
        status: true,
        message: "Successfully login",
        data: {
          token,
          user: {
            id: user.id,
            fullName: user.fullName,
            username: user.userName,
            email: user.email,
            address: user.address,
            city: user.city,
            phoneNumber: user.phoneNumber,
          },
        },
      },
      201
    );
  }
);

/**
 * GET check authentication
 */
auth.openapi(
  {
    method: "get",
    path: "/auth/me",
    description: "Get Authenticated User",
    security: [{ Bearer: [] }],
    middleware: [checkUserToken()],
    responses: {
      200: {
        description: "Authenticated",
      },
    },
    tags: TAGS.AUTH,
  },
  async (c) => {
    try {
      const user: { id: string } = c.get("user" as never);
      const result = await getUser(user.id);

      return c.json(
        {
          status: true,
          message: "Successfully get authenticated user",
          data: result,
        },
        200
      );
    } catch (e) {
      return c.json(
        {
          status: false,
          message: e,
        },
        404
      );
    }
  }
);

export { auth };
