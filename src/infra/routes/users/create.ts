import { Users } from '@/app/entities/users'
import { userSchema } from '@/types/users'
import type { FastifyInstance } from 'fastify'

export async function create(server: FastifyInstance) {
  const users = new Users()

  server.post('/create', async (request, reply) => {
    const { name, email, password } = userSchema.parse(request.body)

    const createUser = await users.create({
      name,
      email,
      password,
    })

    if (createUser.error) {
      reply.status(400).send(createUser.error)
    }

    const token = server.jwt.sign({ sub: createUser.user?.id })

    if (!token) {
      reply.status(500).send('Erro ao gerar token.')
    }

    reply
      .setCookie('token', token, {
        httpOnly: true,
        maxAge: 7 * 86400,
        secure: true,
        sameSite: 'strict',
        path: '*',
      })
      .status(201)
      .send({
        message: 'Usuário criado com sucesso.',
        token,
      })
  })
}
