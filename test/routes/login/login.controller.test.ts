import helper from '@test/helper'
import * as dayjs from 'dayjs'
import JestAdapter from '@test/_utils/JestAdapter'
import loginHelper from './helper/loginHelper'

const app = helper.build()

describe('Login Routes', () => {
  describe('#POST /login', () => {
    const firstGeneratedId = 1

    const userPayload = loginHelper.setupCreateDummyUser(() => app.bcrypt.hash)

    describe('200 OK', () => {
      test('should login successfully given correct email and password', async () => {
        JestAdapter.useFakeTimers()

        const currentTime = dayjs('2020-01-01 00:00:00')

        jest.setSystemTime(currentTime.toDate())
        const res = await loginHelper.loginPost(
          app,
          userPayload.email,
          userPayload.password
        )

        const resJson = res.json()

        expect(resJson).toEqual({
          statusCode: 200,
          message: 'Login successfully',
          data: {
            token: expect.any(String),
          },
        })

        expect(
          res.cookies.find((cookie: any) => cookie.name === 'token')
        ).toEqual({
          domain: process.env.COOKIES_DOMAIN,
          expires: currentTime.add(2, 'hour').toDate(),
          name: 'token',
          value: resJson.data.token,
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'None',
        })

        expect(app.jwt.verify(resJson.data.token)).toEqual({
          iat: expect.any(Number),
          user: {
            id: firstGeneratedId,
          },
        })

        jest.useRealTimers()
      })
    })

    describe('401 Unauthorized', () => {
      test('should reply error given wrong password', async () => {
        const res = await app.inject({
          url: '/login',
          method: 'POST',
          payload: {
            email: userPayload.email,
            password: 'anyWrongPassword',
          },
        })

        expect(res.json()).toEqual({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Email or password is incorrect',
        })
      })

      test('should reply error given wrong email', async () => {
        const res = await app.inject({
          url: '/login',
          method: 'POST',
          payload: {
            email: 'anywrong@email.com',
            password: userPayload.password,
          },
        })

        expect(res.json()).toEqual({
          statusCode: 401,
          error: 'Unauthorized',
          message: 'Email or password is incorrect',
        })
      })
    })
  })
})
