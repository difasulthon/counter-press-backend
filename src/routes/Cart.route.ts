import { OpenAPIHono } from "@hono/zod-openapi";

import { checkUserToken } from "../middlewares/CheckUser.middleware";
import { TAGS } from "../constants";
import {
  addCartItem,
  deleteItem,
  getCarts,
  updateItem,
} from "../services/Carts.service";
import {
  bodyAddCartItemSchema,
  bodyUpdateCartItemSchema,
  paramCartItemSchema,
} from "../schemas/Cart.schema";

const cart = new OpenAPIHono();

/**
 * GET Carts
 */
cart.openapi(
  {
    method: "get",
    path: "/cart",
    description: "Get all carts",
    security: [{ Bearer: [] }],
    middleware: [checkUserToken()],
    responses: {
      200: {
        description: "List of carts",
      },
    },
    tags: TAGS.CARTS,
  },
  async (c) => {
    try {
      const user: { id: string } = c.get("user" as never);
      const carts = await getCarts(user.id);

      return c.json(
        {
          status: true,
          message: "Successfully get carts",
          data: carts,
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
 * POST Add New Cart Item
 */
cart.openapi(
  {
    method: "post",
    path: "/cart/items",
    description: "Add an item to the cart",
    security: [{ Bearer: [] }],
    middleware: [checkUserToken()],
    request: {
      body: {
        content: {
          "application/json": {
            schema: bodyAddCartItemSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Item added to cart successfully",
      },
      400: {
        description: "Invalid input or item addition failed",
      },
    },
    tags: TAGS.CARTS,
  },
  async (c) => {
    try {
      const user: { id: string } = c.get("user" as never);
      const body = c.req.valid("json");
      const { productId } = body;
      const cartItem = await addCartItem(user.id, productId);

      return c.json(
        {
          message: "Item added to cart",
          item: cartItem,
        },
        201
      );
    } catch (e) {
      return c.json(
        {
          message: "Failed to add item to cart",
          error: e,
        },
        400
      );
    }
  }
);

/**
 * PUT Update Cart Item
 */
cart.openapi(
  {
    method: "put",
    path: "/cart/items/{id}",
    description: "Add an item to the cart",
    security: [{ Bearer: [] }],
    middleware: [checkUserToken()],
    request: {
      params: paramCartItemSchema,
      body: {
        content: {
          "application/json": {
            schema: bodyUpdateCartItemSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Success update cart item",
      },
      400: {
        description: "Invalid input",
      },
    },
    tags: TAGS.CARTS,
  },
  async (c) => {
    try {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ message: "ID is required" }, 400);
      }

      const body = c.req.valid("json");
      const { quantity } = body;
      const updatedItem = await updateItem(id, quantity);

      return c.json(
        {
          message: "Success update cart item",
          item: updatedItem,
        },
        201
      );
    } catch (e) {
      return c.json(
        {
          message: "Failed to update cart item",
          error: e,
        },
        400
      );
    }
  }
);

/**
 * DELETE Cart Item
 */
cart.openapi(
  {
    method: "delete",
    path: "/cart/items/{id}",
    description: "Delete cart item",
    security: [{ Bearer: [] }],
    middleware: [checkUserToken()],
    request: {
      params: paramCartItemSchema,
    },
    responses: {
      201: {
        description: "Success delete cart item",
      },
      400: {
        description: "Invalid input",
      },
    },
    tags: TAGS.CARTS,
  },
  async (c) => {
    try {
      const { id } = c.req.valid("param");

      if (!id) {
        return c.json({ message: "ID is required" }, 400);
      }

      await deleteItem(id);

      return c.json(
        {
          message: "Success delete cart item",
        },
        201
      );
    } catch (e) {
      return c.json(
        {
          message: "Failed to delete cart item",
          error: e,
        },
        400
      );
    }
  }
);

export { cart };
