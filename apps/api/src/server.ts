import { env } from '@tracker/env'
import { app } from './app'

app
  .listen({
    host: '0.0.0.0',
    port: env.SERVER_PORT,
  })
  .then(() => console.log(`🚀 HTTP Server running in port ${env.SERVER_PORT}`))
