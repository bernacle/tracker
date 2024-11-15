import { verifyJWT } from '@/http/middlewares/verify-jwt'
import { FastifyInstance } from 'fastify'
import { authenticate } from './authenticate'
import { getSearches } from './get-searches'
import { register } from './register'
import { saveSearch } from './saved-searches'


export async function usersRoutes(app: FastifyInstance) {
  app.post('/users', register)
  app.post('/sessions', authenticate)

  app.post('/searches', { onRequest: [verifyJWT] }, saveSearch)
  app.get('/searches', { onRequest: [verifyJWT] }, getSearches)

}
