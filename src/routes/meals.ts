import { z } from 'zod'
import { knex } from '../database'
import { FastifyInstance } from 'fastify'
import { randomUUID } from 'crypto'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { count } from 'console'

export async function mealRoute(app: FastifyInstance) {
  app.post(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
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
    },
  )

  app.put(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
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
    },
  )

  app.delete(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      await knex('meals').where({ id: mealId }).del()

      reply.status(204).send()
    },
  )

  app.get(
    '/',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const meals = await knex('meals').where({ user_id: request.user?.id })

      return reply.send({ meals })
    },
  )

  app.get(
    '/:mealId',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const paramsSchema = z.object({ mealId: z.string().uuid() })

      const { mealId } = paramsSchema.parse(request.params)

      const responseMealForDb = await knex('meals')
        .where({ id: mealId })
        .andWhere({ user_id: request.user?.id })

      reply.send({ responseMealForDb })
    },
  )

  app.get(
    '/totalMeals',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const totalMeals = await knex('meals')
        .where({
          user_id: request.user?.id,
        })
        .count({ count: '*' })

      reply.send({ totalMeals })
    },
  )

  app.get(
    '/onDiet',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const totalMealsOnDiet = await knex('meals')
        .where({
          user_id: request.user?.id,
        })
        .where('is_on_diet', '1')
        .count({ count: '*' })

      reply.send({ totalMealsOnDiet })
    },
  )

  app.get(
    '/noDiet',
    { preHandler: [checkSessionIdExists] },
    async (request, reply) => {
      const totalMealsNoDiet = await knex('meals')
        .where({
          user_id: request.user?.id,
        })
        .where('is_on_diet', '0')
        .count({ count: '*' })

      reply.send({ totalMealsNoDiet })
    },
  )
}
