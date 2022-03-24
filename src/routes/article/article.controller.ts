import { FastifyPluginAsync } from 'fastify'
import ArticleEntity from '@src/entity/article'

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/article', async (req, reply) => {
    const [articles, total] =
      await ArticleEntity.createQueryBuilder().getManyAndCount()

    reply.send({
      data: articles,
      total,
    })
  })
}

export default routes
