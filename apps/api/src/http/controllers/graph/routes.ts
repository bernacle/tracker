import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { getCountries } from "./countries";
import { data } from "./data";


export async function graphRoutes(app: FastifyInstance) {
  app.post('/graph', { onRequest: [verifyJWT] }, data)
  app.get('/countries', { onRequest: [verifyJWT] }, getCountries)
}
