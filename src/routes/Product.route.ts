import { OpenAPIHono } from "@hono/zod-openapi";

import { ROUTES, MESSAGE, TAGS } from "../constants";
import {
  addProduct,
  deleteProductById,
  getProductBySlug,
  getProducts,
  updateProductBySlug,
} from "../services/Products.service";
import {
  bodyAddProductSchema,
  bodyUpdateProductSchema,
  paramProductByIdSchema,
  paramProductBySlugSchema,
  queryProductSchema,
} from "../schemas/Product.schema";

const product = new OpenAPIHono();

/**
 * GET Products
 */
product.openapi(
  {
    method: "get",
    path: ROUTES.PRODUCTS,
    description: "Get all products",
    request: {
      query: queryProductSchema,
    },
    responses: {
      200: {
        description: "List of products",
      },
    },
    tags: TAGS.PRODUCTS,
  },
  async (c) => {
    try {
      const query = c.req.valid("query");
      const products = await getProducts(query);

      return c.json(
        {
          status: true,
          message: MESSAGE.SUCCESS.GET_PRODUCTS,
          data: products,
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
 * GET Product By Slug
 */
product.openapi(
  {
    method: "get",
    path: "/product/{slug}",
    description: "Get product by Slug",
    request: {
      params: paramProductBySlugSchema,
    },
    responses: {
      200: {
        description: "Product item",
      },
      404: {
        description: "Product not found",
      },
    },
    tags: TAGS.PRODUCTS,
  },
  async (c) => {
    const { slug } = c.req.valid("param");

    if (!slug)
      return c.json({ status: false, message: "Slug is not found" }, 404);

    const product = await getProductBySlug(slug);

    return c.json(
      {
        status: true,
        message: MESSAGE.SUCCESS.GET_PRODUCT,
        data: product,
      },
      200
    );
  }
);

/**
 * POST Add New Product
 */
product.openapi(
  {
    method: "post",
    path: ROUTES.PRODUCTS,
    description: "Add product",
    request: {
      body: {
        content: {
          "application/json": {
            schema: bodyAddProductSchema,
          },
        },
      },
    },
    responses: {
      201: {
        description: "Add new product",
      },
    },
    tags: TAGS.PRODUCTS,
  },
  async (c) => {
    let body = c.req.valid("json");

    const { name, price, image, brandId, stock, brandName } = body;
    const newProduct = await addProduct({
      name,
      price,
      image,
      brandId,
      stock,
      brandName,
    });

    return c.json(
      {
        status: true,
        message: MESSAGE.SUCCESS.ADD_PRODUCT,
        data: newProduct,
      },
      201
    );
  }
);

/**
 * DELETE Product
 */
product.openapi(
  {
    method: "delete",
    path: ROUTES.PRODUCT,
    description: "Delete product",
    request: {
      params: paramProductByIdSchema,
    },
    responses: {
      200: {
        description: "Delete product",
      },
    },
    tags: TAGS.PRODUCTS,
  },
  async (c) => {
    const { id } = c.req.valid("param");

    if (!id) return c.json({ status: false, message: "ID is not found" }, 404);

    const deletedProduct = await deleteProductById(id);

    return c.json({
      status: true,
      message: MESSAGE.SUCCESS.DELETED_PRODUCT,
      data: deletedProduct,
    });
  }
);

/**
 * PUT Update Product By Slug
 */
product.openapi(
  {
    method: "put",
    path: "/product/{slug}",
    description: "Update product by slug",
    request: {
      params: paramProductBySlugSchema,
      body: {
        content: {
          "application/json": {
            schema: bodyUpdateProductSchema,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Update product",
      },
    },
    tags: TAGS.PRODUCTS,
  },
  async (c) => {
    const slug = c.req.param("slug");
    let body = c.req.valid("json");

    if (!slug)
      return c.json({ status: false, message: "Slug is not found" }, 404);

    const { price, name, stock, image, brandId, brandName } = body;
    const newData = {
      price,
      name,
      stock,
      image,
      brandId,
      brandName,
    };
    const updatedProduct = await updateProductBySlug(slug, newData);

    return c.json({
      status: true,
      message: MESSAGE.SUCCESS.UPDATED_PRODUCT,
      data: updatedProduct,
    });
  }
);

export { product };
