import { FastifyPluginAsync } from 'fastify'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/example', async () => {
    const { orm } = fastify

    const sum = await orm.query('SELECT 9 + 2 as sum')

    return {
      sum,
    }
  })
}

export default example
