import fastifyCors from '@fastify/cors';

import fastifyJwt from '@fastify/jwt';
import { env } from '@tracker/env';
import fastify from 'fastify';
import { ZodError } from 'zod';
import { graphRoutes } from './http/controllers/graph/routes';
import { usersRoutes } from './http/controllers/users/routes';

export const app = fastify()


app.register(fastifyJwt, {
  secret: env.JWT_SECRET,
  sign: {
    expiresIn: '1h',
  },
})

app.register(fastifyCors)


app.register(async function publicRoutes(app) {
  app.get('/health', async (request, reply) => {
    return { status: "OK" };
  });
})

app.register(graphRoutes)
app.register(usersRoutes)

app.setErrorHandler((error, _, reply) => {
  if (error instanceof ZodError) {
    return reply
      .status(400)
      .send({ message: 'Validation error.', issues: error.format() })
  }

  console.error(error)

  return reply.status(500).send({ message: 'Internal server error' })
})
