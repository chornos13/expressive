import { FastifyPluginAsync } from 'fastify'
import ArticleEntity from '@src/entity/article'
import ArticleDetailEntity from '@src/entity/articleDetail'
import { waterfall } from 'async'

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/article', async (req, reply) => {
    const [articles, total] =
      await ArticleEntity.createQueryBuilder().getManyAndCount()

    reply.send({
      data: articles,
      total,
    })
  })

  fastify.post('/article', (req, reply) => {
    waterfall(
      [
        async function validateAuth() {
          const { token } = req.cookies

          if (!token) {
            throw fastify.httpErrors.forbidden('Invalid token')
          }

          try {
            fastify.jwt.verify(token)
          } catch (e) {
            throw fastify.httpErrors.forbidden('Invalid token')
          }
        },
        async function createArticle() {
          const data = await fastify.orm.transaction(async (entityManager) => {
            const { articleDetail, ...article } = req.body as {
              title: string
              articleDetail: Object
            }

            const articleDetailEntity: any =
              ArticleDetailEntity.create(articleDetail)

            await entityManager.save(articleDetailEntity)

            const wordCount = articleDetailEntity.description.split(' ').length
            const wordsPerMinute = 200
            const minuteReadingTime = Math.ceil(wordCount / wordsPerMinute)

            return entityManager.save(
              ArticleEntity.create({
                ...article,
                wordCount,
                minuteReadingTime,
                articleDetail: articleDetailEntity,
              })
            )
          })

          return data
        },
      ],
      (err, article?: ArticleEntity) => {
        if (err) {
          return reply.send(err)
        }

        return reply.send({
          data: article,
        })
      }
    )
  })
}

export default routes
