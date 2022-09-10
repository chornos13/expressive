import fp from 'fastify-plugin'
import fastifyCors from '@fastify/cors'

export default fp(async (fastify) => {
  fastify.register(fastifyCors, {
    origin: 'http://localhost:3000',
    credentials: true,
  })
})
