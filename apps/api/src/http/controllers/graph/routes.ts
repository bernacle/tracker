import type { FastifyInstance } from "fastify";
import { handle } from "./handle";


export async function graphRoutes(app: FastifyInstance) {
  app.post('/graph', handle)
}
