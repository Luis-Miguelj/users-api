import type { FastifyInstance } from 'fastify'
import { loginSchema } from '@/types/users'
import { Users } from '@/app/entities/users'

export async function login(server: FastifyInstance) {
  const users = new Users()
  server.post('/login', async (req, reply) => {
    const { email, password } = loginSchema.parse(req.body)

    const { user, error } = await users.login({
      email,
      password,
    })

    if (error) {
      return reply.status(404).send({
        message: error,
      })
    }

    const token = server.jwt.sign({ sub: user?.email })

    if (token) {
      return reply
        .setCookie('token', token, { httpOnly: true, secure: true, path: '*' })
        .send({
          message: 'Usuário logado',
          token: token,
        })
    }

    return reply.status(404).send({
      message: 'Erro ao logar usuário',
    })
  })
}
