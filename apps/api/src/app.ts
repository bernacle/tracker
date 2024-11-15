import fastify from 'fastify';
import { ZodError } from 'zod';
import { graphRoutes } from './http/controllers/graph/routes';

export const app = fastify()

app.register(async function publicRoutes(app) {
  app.get('/health', async (request, reply) => {
    return { status: "OK" };
  });
})

app.register(graphRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})
