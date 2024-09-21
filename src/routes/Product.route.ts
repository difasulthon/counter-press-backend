import { Hono } from "hono";
import { OpenAPIHono } from '@hono/zod-openapi'

import { Product } from "@prisma/client";

import { 
  ROUTES, MESSAGE, TAGS, HEADER_TYPE, CONTENT_TYPE as CONTENT_TYPE_HEADER, SORT_BY 
} from '../constants';
import { 
  addProduct, deleteProductById, getProductById, getProducts, 
  updateProductById
} from "../services/Products.service";
import { 
  bodyAddProductSchema, bodyUpdateProductSchema, paramProductByIdSchema, queryProductSchema 
} from "../schemas/Product.schema";

const product = new OpenAPIHono()

const {CONTENT_TYPE} = HEADER_TYPE
const {APPLICATION_JSON} = CONTENT_TYPE_HEADER
const {ID} = SORT_BY

/**
 * GET Products
 */
product
  .openapi(
    {
      method: 'get',
      path: ROUTES.PRODUCTS,
      description: 'Get all products',
      request: {
        query: queryProductSchema,
      },
      responses: {
        200: {
          description: 'List of products',
        },
      },
      tags: TAGS.PRODUCTS,
    },
    async (c) => {
      try {
        const query = c.req.query();
        const products = await getProducts(query);
    
        return c.json({
          status: true,
          message: MESSAGE.SUCCESS.GET_PRODUCTS,
          data: products
        }, 200)
      } catch (e) {
        return c.json({
          status: false,
          message: e,
        }, 404)
      }
    }
  )

/**
 * GET Product By ID
 */
product
  .openapi(
    {
      method: 'get',
      path: ROUTES.PRODUCT,
      description: 'Get product by Id',
      request: {
        params: paramProductByIdSchema,
      },
      responses: {
        200: {
          description: 'Product item',
        },
        404: {
          description: 'Product not found',
        },
      },
      tags: TAGS.PRODUCTS,
    },
    async (c) => {
      const id = c.req.param(ID)
      const product = await getProductById(id)
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.GET_PRODUCT,
        data: product
      }, 200)
    }
  )

/**
 * POST Add New Product
 */
product
  .openapi(
    {
      method: 'post',
      path: ROUTES.PRODUCTS,
      description: 'Add product',
      request: {
        body: {
          content: {
            'application/json': {
              schema: bodyAddProductSchema
            },
          }
        }
      },
      responses: {
        201: {
          description: 'Add new product',
        }
      },
      tags: TAGS.PRODUCTS,
    },
    async (c) => {
      let body: Partial<Product>
      const contentType = c.req.header(CONTENT_TYPE)
    
      if (contentType === APPLICATION_JSON) {
        body = await c.req.json()
      } else {
        body = await c.req.parseBody<Partial<Product>>()
      }
    
      const {name, price, image, brand_id} = body
      const newProduct = await addProduct({name, price, image, brand_id})
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.ADD_PRODUCT,
        data: newProduct
      }, 201)
    }
  )

/**
 * DELETE Product
 */
product
  .openapi(
    {
      method: 'delete',
      path: ROUTES.PRODUCT,
      description: 'Delete product',
      request: {
       params: paramProductByIdSchema
      },
      responses: {
        200: {
          description: 'Delete product',
        }
      },
      tags: TAGS.PRODUCTS,
    },
    async (c) => {
      const {id} = c.req.param()
      const deletedProduct = await deleteProductById(id)
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.DELETED_PRODUCT,
        data: deletedProduct
      })
    }
  )

/**
 * PUT Update Product
 */
product
  .openapi(
    {
      method: 'put',
      path: ROUTES.PRODUCT,
      description: 'Update product',
      request: {
       params: paramProductByIdSchema,
       body: {
        content: {
          'application/json': {
            schema: bodyUpdateProductSchema
          }
        }
       }
      },
      responses: {
        200: {
          description: 'Update product',
        }
      },
      tags: TAGS.PRODUCTS,
    },
    async (c) => {
      const id = c.req.param(ID)
      let body: Partial<Product>
      const contentType = c.req.header(CONTENT_TYPE)
    
      if (contentType === APPLICATION_JSON) {
        body = await c.req.json()
      } else {
        body = await c.req.parseBody<Partial<Product>>()
      }
    
      const {price, name, available_stock, brand_id, image} = body
      const newData = {
        price, name, available_stock, brand_id, image
      }
      const updatedProduct = await updateProductById({id, ...newData})
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.UPDATED_PRODUCT,
        data: updatedProduct
      })
    }
  )

export { product };