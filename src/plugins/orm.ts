import fp from 'fastify-plugin'
import * as fastifyTypeorm from 'fastify-typeorm-plugin'

const {
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  POSTGRES_SERVICE,
  POSTGRES_PORT,
  POSTGRES_DB,
} = process.env

export default fp(async (fastify) => {
  fastify.register(fastifyTypeorm, {
    type: 'postgres',
    username: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
    host: POSTGRES_SERVICE,
    port: Number(POSTGRES_PORT),
    database: POSTGRES_DB,
    // url: `postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_SERVICE}:${POSTGRES_PORT}/${POSTGRES_DB}`,
    entities: [`${__dirname}/../entity/**/*.{ts,js}`],
  })
})
