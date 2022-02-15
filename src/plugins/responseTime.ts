import fp from 'fastify-plugin'

export default fp(async (fastify) => {
  fastify.addHook('onResponse', (request, reply, done) => {
    reply.getResponseTime()
    done()
  })
})
