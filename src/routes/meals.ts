import { z } from 'zod'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'

export async function mealRoute(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const createNewMealBodySchema = z.object({
      userId: z.string(),
      name: z.string(),
      description: z.string(),
      date: z.string(),
      isOnDiet: z.boolean(),
    })

    const { userId, name, description, date, isOnDiet } =
      createNewMealBodySchema.parse(request.body)

    await knex('meals').insert({
      id: randomUUID(),
      user_id: userId,
      name,
      description,
      date,
      is_on_diet: isOnDiet,
    })

    reply.status(201).send()
  })

  app.put('/:mealId', async (request, reply) => {
    const paramsSchema = z.object({ mealId: z.string().uuid() })

    // resgatando ID da requisição
    const { mealId } = paramsSchema.parse(request.params)

    const updateMealBodySchema = z.object({
      userId: z.string(),
      name: z.string(),
      description: z.string(),
      date: z.string(),
      isOnDiet: z.boolean(),
    })

    const { userId, name, description, date, isOnDiet } =
      updateMealBodySchema.parse(request.body)

    await knex('meals').where({ id: mealId }).update({
      user_id: userId,
      name,
      description,
      date,
      is_on_diet: isOnDiet,
    })

    reply.status(204).send()
  })
}
