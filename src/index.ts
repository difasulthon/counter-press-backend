import { OpenAPIHono } from "@hono/zod-openapi";
import { swaggerUI } from "@hono/swagger-ui";
import { cors } from "hono/cors";

import { DOC, MESSAGE, ROUTES } from "./constants";
import { product } from "./routes/Product.route";
import { brand } from "./routes/Brands.route";
import { auth } from "./routes/Auth.route";
import { user } from "./routes/User.route";

const api = new OpenAPIHono({ strict: false });

api.use("/*", cors());
api.route(ROUTES.BASE, auth);
api.route(ROUTES.BASE, product);
api.route(ROUTES.BASE, brand);
api.route(ROUTES.BASE, user);
api.notFound((c) => c.json({ message: MESSAGE.ERROR.NOT_FOUND }, 404));

api.doc(ROUTES.DOC, {
  openapi: DOC.VERSION.OPEN_API,
  info: {
    version: DOC.VERSION.INFO,
    title: DOC.TITLE,
    description: DOC.DESC,
  },
});
api.get(ROUTES.BASE, swaggerUI({ url: ROUTES.DOC }));

export default api;
