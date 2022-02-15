import fp from 'fastify-plugin'
import fastifyBcrypt from 'fastify-bcrypt'

export default fp(async (fastify) => {
  fastify.register(fastifyBcrypt, {
    saltWorkFactor: 12,
  })
})
