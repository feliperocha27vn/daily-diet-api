import { FastifyReply, FastifyRequest } from 'fastify'
import { knex } from '../database' // Importe sua instância do Knex

export async function checkSessionIdExists(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      // Importante: retorne para evitar que o código continue
      error: 'Unauthorized',
    })
  }

  const user = await knex('users') // Assumindo que sua tabela de usuários se chama 'users'
    .where('session_id', sessionId) // Assumindo que você tem uma coluna 'session_id' na tabela 'users'
    .first() // Retorna apenas o primeiro usuário encontrado

  if (!user) {
    return reply.status(401).send({
      // Importante: retorne para evitar que o código continue
      error: 'Unauthorized', // Usuário não encontrado com este sessionId (sessão inválida)
    })
  }

  request.user = user // Adiciona as informações do usuário ao objeto request
}
