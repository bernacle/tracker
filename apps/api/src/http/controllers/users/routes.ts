import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { register } from './register'


export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  // Authenticated routes
  // app.get('/me', { onRequest: [verifyJWT] }, profile)
}
