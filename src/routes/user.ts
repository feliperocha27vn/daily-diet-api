import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { FastifyInstance } from 'fastify'

export async function userRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createNewUserBodySchema = z.object({
      name: z.string(),
      email: z.string(),
    })

    const { name, email } = createNewUserBodySchema.parse(request.body)

    let sessionId = request.cookies.sessionId

    if (!sessionId) {
      sessionId = randomUUID()

      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 24 * 7, // 7 days
      })
    }

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      session_id: sessionId,
    })

    reply.status(201).send()
  })
}
