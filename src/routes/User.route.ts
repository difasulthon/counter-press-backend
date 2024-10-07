import { OpenAPIHono } from "@hono/zod-openapi";

import {
  paramUserByUserNameSchema,
  queryUserSchema,
} from "../schemas/User.schema";
import { TAGS } from "../constants";
import { getUsers, getUsersByUserName } from "../services/User.service";

const user = new OpenAPIHono();

/**
 * GET Users
 */
user.openapi(
  {
    method: "get",
    path: "/users",
    description: "Get all users",
    request: {
      query: queryUserSchema,
    },
    responses: {
      200: {
        description: "List of users",
      },
    },
    tags: TAGS.USERS,
  },
  async (c) => {
    try {
      const query = c.req.query();
      const users = await getUsers(query);

      return c.json(
        {
          status: true,
          message: "Successfully get users",
          data: users,
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

/**
 * GET User by User Name
 */
user.openapi(
  {
    method: "get",
    path: "/users/{userName}",
    description: "Get user by user name",
    request: {
      params: paramUserByUserNameSchema,
    },
    responses: {
      200: {
        description: "User item",
      },
    },
    tags: TAGS.USERS,
  },
  async (c) => {
    try {
      const { userName } = c.req.valid("param");

      const user = await getUsersByUserName(userName);

      return c.json(
        {
          status: true,
          message: "Successfully get user",
          data: user,
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

export { user };
