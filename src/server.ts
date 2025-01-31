import fastify from 'fastify'
import cookie from '@fastify/cookie'
import { userRoute } from './routes/user'
import { mealRoute } from './routes/meals'
import { env } from './env'

const app = fastify()

app.register(cookie)

app.register(userRoute, {
  prefix: 'user',
})
app.register(mealRoute, {
  prefix: 'meal',
})

app.listen({ port: env.PORT }).then(() => {
  console.log('HTTP Server is running')
})
