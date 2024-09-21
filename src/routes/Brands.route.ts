import { Hono } from "hono";
import { OpenAPIHono } from "@hono/zod-openapi";

import { Brand, Brands } from "@prisma/client";

import { 
  MESSAGE, ROUTES, TAGS, HEADER_TYPE, CONTENT_TYPE as CONTENT_TYPE_HEADER, SORT_BY 
} from "../constants";
import { 
  addBrands, deleteBrandById, getBrandById, getBrands, updateBrandById 
} from "../services/Brands.service";
import { 
  bodyAddBrandSchema, bodyUpdateBrandSchema, paramBrandByIdSchema, queryBrandSchema
} from "../schemas/Brand.schema";

const brand = new OpenAPIHono()

const {CONTENT_TYPE} = HEADER_TYPE
const {APPLICATION_JSON} = CONTENT_TYPE_HEADER
const {ID} = SORT_BY

/**
 * GET Brands
 */
brand
  .openapi(
    {
      method: 'get',
      path: ROUTES.BRANDS,
      description: 'Get all brands',
      request: {
        query: queryBrandSchema,
      },
      responses: {
        200: {
          description: 'List of brands',
        },
      },
      tags: TAGS.BRANDS,
    },
    async (c) => {
      try {
        const query = c.req.query();
        const brands = await getBrands(query);
    
        return c.json({
          status: true,
          message: MESSAGE.SUCCESS.GET_BRANDS,
          data: brands
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
 * GET Brand By ID
 */
brand
  .openapi(
    {
      method: 'get',
      path: ROUTES.BRAND,
      description: 'Get brand by Id',
      request: {
        params: paramBrandByIdSchema,
      },
      responses: {
        200: {
          description: 'Brand item',
        },
        404: {
          description: 'Brand not found',
        },
      },
      tags: TAGS.BRANDS,
    },
    async (c) => {
      const id = c.req.param(ID)
      const brand = await getBrandById(id)
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.GET_BRAND,
        data: brand
      }, 200)
    }
  )

/**
 * POST Add New Brand
 */
brand
  .openapi(
    {
      method: 'post',
      path: ROUTES.BRANDS,
      description: 'Add brand',
      request: {
        body: {
          content: {
            'application/json': {
              schema: bodyAddBrandSchema
            },
          }
        }
      },
      responses: {
        201: {
          description: 'Add new brand',
        }
      },
      tags: TAGS.BRANDS,
    },
    async (c) => {
      let body: Partial<Brands>
      const contentType = c.req.header(CONTENT_TYPE)
    
      if (contentType === APPLICATION_JSON) {
        body = await c.req.json()
      } else {
        body = await c.req.parseBody<Partial<Brands>>()
      }
    
      const {name} = body
      const newBrand = await addBrands({name})
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.ADD_BRAND,
        data: newBrand
      }, 201)
    }
  )

/**
 * DELETE Brand
 */
brand
  .openapi(
    {
      method: 'delete',
      path: ROUTES.BRAND,
      description: 'Delete brand',
      request: {
       params: paramBrandByIdSchema
      },
      responses: {
        200: {
          description: 'Delete brand',
        }
      },
      tags: TAGS.BRANDS,
    },
    async (c) => {
      const {id} = c.req.param()
      const deletedBrand = await deleteBrandById(id)
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.DELETED_PRODUCT,
        data: deletedBrand
      })
    }
  )

/**
 * PUT Update Brand
 */
brand
  .openapi(
    {
      method: 'put',
      path: ROUTES.BRAND,
      description: 'Update brand',
      request: {
       params: paramBrandByIdSchema,
       body: {
        content: {
          'application/json': {
            schema: bodyUpdateBrandSchema
          }
        }
       }
      },
      responses: {
        200: {
          description: 'Update brand',
        }
      },
      tags: TAGS.BRANDS,
    },
    async (c) => {
      const id = c.req.param(ID)
      let body: Partial<Brand>
      const contentType = c.req.header(CONTENT_TYPE)
    
      if (contentType === APPLICATION_JSON) {
        body = await c.req.json()
      } else {
        body = await c.req.parseBody<Partial<Brand>>()
      }
    
      const {name} = body
      const updateBrand = await updateBrandById({id, name})
    
      return c.json({
        status: true,
        message: MESSAGE.SUCCESS.UPDATED_BRAND,
        data: updateBrand
      })
    }
  )

export { brand };