import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { getCountries } from "./countries";
import { handle } from "./handle";


export async function graphRoutes(app: FastifyInstance) {
  app.post('/graph', { onRequest: [verifyJWT] }, handle)
  app.get('/countries', { onRequest: [verifyJWT] }, getCountries)
}
