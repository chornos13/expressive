import fp from 'fastify-plugin'
import fastifyCookie from 'fastify-cookie'

export default fp(async (fastify) => {
  fastify.register(fastifyCookie, {
    secret: {
      sign: (value: string) => {
        // sign using custom logic
        return value
      },
      unsign: (value: string) => {
        // unsign using custom logic
        return {
          valid: true, // the cookie has been unsigned successfully
          renew: false, // the cookie has been unsigned with an old secret
          value,
        }
      },
    } as any,
  })
})
