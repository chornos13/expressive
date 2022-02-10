import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/', async () => {
    const client = await fastify.pg.connect()

    const sumResult = await client.query<{ sum: number }>('SELECT 9 + 2 as sum')

    client.release()

    return {
      sum: sumResult.rows,
    }
  })
}

export default example
