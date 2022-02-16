import helper from '@test/helper'
import userService from '@src/routes/user/user.service'

const app = helper.build()

describe('User Routes', () => {
  describe('#POST /login', () => {
    const userPayload = {
      firstName: 'anyFirstName',
      lastName: 'anyLastName',
      email: 'anyemail@email.com',
      password: 'anypassword',
      confirmPassword: 'anypassword',
    }

    beforeAll((cb) => {
      userService.postRegisterUser(userPayload, app.bcrypt.hash, () => cb())
    })

    describe('200 OK', () => {
      test('should login successfully given correct email and password', async () => {
        const res = await app.inject({
          url: '/login',
          method: 'POST',
          payload: {
            email: userPayload.email,
            password: userPayload.password,
          },
        })

        expect(res.json()).toEqual({
          statusCode: 200,
          message: 'Login successfully',
        })
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
