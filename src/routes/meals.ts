import { z } from 'zod'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'

export async function mealRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createNewMealBodySchema = z.object({
      name: z.string(),
      description: z.string(),
      date: z.coerce.date(),
      isOnDiet: z.boolean(),
    })

    const { name, description, date, isOnDiet } = createNewMealBodySchema.parse(
      request.body,
    )

    await knex('meals').insert({
      id: randomUUID(),
      name,
      description,
      date,
      isOnDiet,
    })

    reply.status(201).send()
  })
}
