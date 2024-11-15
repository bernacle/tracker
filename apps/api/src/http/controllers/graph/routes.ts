import { verifyJWT } from "@/http/middlewares/verify-jwt";
import type { FastifyInstance } from "fastify";
import { handle } from "./handle";


export async function graphRoutes(app: FastifyInstance) {
  app.post('/graph', { onRequest: [verifyJWT] }, handle)
}
