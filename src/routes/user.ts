import { z } from 'zod'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function dailyDietRoutes(app) {
  app.post('/', async (request, reply) => {
    const createNewUserBodySchema = z.object({
      name: z.string(),
    })

    const { name } = createNewUserBodySchema.parse(request.body)

    await knex('users').insert({
      id: randomUUID(),
      name,
    })

    reply.status(201).send()
  })
}
