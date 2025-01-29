import fastify from 'fastify'
import { dailyDietRoutes } from './routes/user'
import { env } from './env'

const app = fastify()

app.register(dailyDietRoutes, {
  prefix: 'user',
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server is running')
})
