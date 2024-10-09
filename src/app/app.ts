import { fastify } from 'fastify'
import cors from '@fastify/cors'
import jwt from '@fastify/jwt'
import cookies from '@fastify/cookie'

import { env } from '@/types/env'
import { create } from '@/infra/routes/users/create'
import { read } from '@/infra/routes/users/read'
import { logout } from '@/infra/routes/logout'
import { login } from '@/infra/routes/login'

const app = fastify()
  .register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  })
  .register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: 7 * 86400,
    },
  })
  .register(cookies, {
    secret: env.COOKIE_SECRET,
    parseOptions: { maxAge: 7 * 86400, httpOnly: true, secure: true },
  })
  .addHook('onRequest', async (request, reply) => {
    const url = request.url
    const token = request.cookies.token

    if ((!token && url === '/create') || (!token && url === '/login')) {
      return
    }

    if (!token) {
      return reply.status(401).send('Unauthorized')
    }

    const tokenVerify = app.jwt.verify(token)

    if (!tokenVerify) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'Token inválido',
      })
    }
  })
  .register(create)
  .register(read)
  .register(logout)
  .register(login)

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('Server is running on port 3333')
  })
