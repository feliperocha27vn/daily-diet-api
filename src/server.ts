import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { dailyDietRoutes } from './routes/user'
import { env } from './env'

const app = fastify()

app.register(cookie)

app.register(dailyDietRoutes, {
  prefix: 'user',
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server is running')
})
