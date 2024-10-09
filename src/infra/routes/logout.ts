import type { FastifyInstance } from 'fastify'

export async function logout(server: FastifyInstance) {
  server.post('/logout', async (request, reply) => {
    return reply.clearCookie('token', { path: '*' }).status(200).send({
      message: 'Usuário deslogado',
    })
  })
}
