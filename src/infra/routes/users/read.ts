import type { FastifyInstance } from 'fastify'
import { prisma } from '@/utils/prisma'

export async function read(server: FastifyInstance) {
  server.get('/', async (request, reply) => {
    if (!prisma.users) {
      return reply.status(404).send('Erro ao buscar os usuários.')
    }

    return reply.send({
      users: await prisma.users.findMany(),
    })
  })
}
