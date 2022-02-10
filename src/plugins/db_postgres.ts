import fp from 'fastify-plugin'
import { fastifyPostgres } from 'fastify-postgres'

export default fp(async (fastify) => {
  const {
    POSTGRES_USER,
    POSTGRES_PASSWORD,
    POSTGRES_SERVICE,
    POSTGRES_PORT,
    POSTGRES_DB,
  } = process.env

  fastify.register(fastifyPostgres, {
    connectionString: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVICE}:${POSTGRES_PORT}/${POSTGRES_DB}`,
  })
})
