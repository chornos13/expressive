import helper from '@test/helper'
import ArticleEntity from '@src/entity/article'
import ArticleDetailEntity from '@src/entity/articleDetail'
import loginHelper from '@test/routes/login/helper/loginHelper'
import { LightMyRequestResponse } from 'fastify'

const app = helper.build()

beforeEach(async () => {
  await app.orm.query('TRUNCATE TABLE "article" RESTART IDENTITY;')
  await app.orm.query('TRUNCATE TABLE "articleDetail" RESTART IDENTITY;')
})

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
    const userPayload = loginHelper.setupCreateDummyUser(() => app.bcrypt.hash)

    describe('200 OK', () => {
      let loginRes: LightMyRequestResponse
      beforeAll(async () => {
        loginRes = await loginHelper.loginPost(
          app,
          userPayload.email,
          userPayload.password
        )
      })

      const getCookies = () => {
        return loginRes.cookies.reduce((acc: any, curVal: any) => {
          acc[curVal.name] = curVal.value
          return acc
        }, {})
      }

      test('should insert data and automatically calculate wordCount and minuteReadingTime', async () => {
        const res = await app.inject({
          url: '/article',
          method: 'POST',
          cookies: getCookies(),
          payload: {
            title: 'anyTitle',
            articleDetail: {
              description: 'any description',
            },
          },
        })

        const resJson = res.json()

        expect(resJson).toEqual({
          data: {
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
          },
        })
      })
    })

    describe('403 Forbidden', () => {
      test('should reply 403 when token not send', async () => {
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
          statusCode: 403,
          error: 'Forbidden',
          message: 'Invalid token',
        })
      })

      test('should reply 403 when invalid token is sent', async () => {
        const res = await app.inject({
          url: '/article',
          method: 'POST',
          cookies: {
            token: 'invalid token',
          },
          payload: {
            title: 'anyTitle',
            articleDetail: {
              description: 'any description',
            },
          },
        })

        const resJson = res.json()

        expect(resJson).toEqual({
          statusCode: 403,
          error: 'Forbidden',
          message: 'Invalid token',
        })
      })
    })
  })
})
