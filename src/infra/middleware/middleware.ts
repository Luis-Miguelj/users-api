import type { FastifyInstance } from 'fastify'

// export async function middleware(server: FastifyInstance) {
//   server.addHook('onRequest', async (request, reply) => {
//     const token = request.cookies.token

//     console.log(token)

//     if (!token) {
//       return reply.status(401).send('Unauthorized')
//     }

//     server.jwt.verify(token)

//     return 'ok'
//   })
// }

export const middleware = async (server: FastifyInstance) => {
  server.addHook('onRequest', async (request, reply) => {
    const token = request.cookies.token

    console.log(token)

    if (!token) {
      return reply.status(401).send('Unauthorized')
    }

    server.jwt.verify(token)

    return reply.status(200).send('ok')
  })
}
