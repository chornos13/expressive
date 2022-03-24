import helper from '@test/helper'
import ArticleEntity from '@src/entity/article'
import ArticleDetailEntity from '@src/entity/articleDetail'

const app = helper.build()

describe('Article Routes', () => {
  describe('#GET /article', () => {
    describe('200 OK', () => {
      test('should return articles when exists', async () => {
        await app.orm.transaction(async (entityManager) => {
          const articleDetail = ArticleDetailEntity.create({
            description: 'any description',
          })

          await entityManager.save(articleDetail)

          await entityManager.save(
            ArticleEntity.create({
              title: 'anyTitle',
              wordCount: 2,
              minuteReadingTime: 1,
              articleDetail,
            })
          )
        })

        const res = await app.inject({
          url: '/article',
          method: 'GET',
        })

        const resJson = res.json()

        expect(resJson).toEqual({
          data: [
            {
              id: 1,
              title: 'anyTitle',
              createdAt: expect.any(String),
              minuteReadingTime: 1,
              wordCount: 2,
              updatedAt: null,
              version: 1,
            },
          ],
          total: 1,
        })
      })
    })
  })

  describe('#POST /article', () => {
    describe('200 OK', () => {
      test('should insert data and automatically calculate wordCount and minuteReadingTime', async () => {
        const res = await app.inject({
          url: '/article',
          method: 'POST',
          payload: {
            title: 'anyTitle',
            articleDetail: {
              description: 'any description',
            },
          },
        })

        const resJson = res.json()

        expect(resJson).toEqual({
          id: 1,
          title: 'anyTitle',
          articleDetail: {
            id: 1,
            description: 'any description',
          },
          createdAt: expect.any(String),
          minuteReadingTime: 1,
          wordCount: 2,
          updatedAt: null,
          version: 1,
        })
      })
    })
  })
})
