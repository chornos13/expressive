import UserEntity from '@src/entity/user'
import helper from '@test/helper'

const app = helper.build()

beforeEach(async () => {
  await UserEntity.query('TRUNCATE TABLE "user" RESTART IDENTITY;')
})

const firstGeneratedId = 1
describe('User Routes', () => {
  describe('#POST /register/user', () => {
    describe('200 OK', () => {
      test('should add user to DB given payload data', async () => {
        const payload = {
          firstName: 'anyFirstName',
          lastName: 'anyLastName',
          email: 'anyuser@anyemail.com',
          password: '123456',
          confirmPassword: '123456',
        }
        const res = await app.inject({
          url: '/register/user',
          method: 'POST',
          payload: {
            ...payload,
          },
        })

        expect(res.json()).toEqual({
          data: {
            id: firstGeneratedId,
            firstName: payload.firstName,
            lastName: payload.lastName,
            email: payload.email,
          },
        })

        const user = await UserEntity.findOneBy({
          id: firstGeneratedId,
        })

        expect(user).toEqual({
          id: firstGeneratedId,
          firstName: payload.firstName,
          lastName: payload.lastName,
          email: payload.email,
          hashedPassword: expect.any(String),
        })
      })

      test('should encrypt password with bcrypt', async () => {
        const passwordInput = '123456'

        const payload = {
          firstName: 'anyFirstName',
          lastName: 'anyFirstName',
          email: 'anyuser@anyemail.com',
          password: passwordInput,
          confirmPassword: passwordInput,
        }

        await app.inject({
          url: '/register/user',
          method: 'POST',
          payload: {
            ...payload,
          },
        })

        const user = await UserEntity.findOneBy({
          id: firstGeneratedId,
        })

        expect(
          await app.bcrypt.compare(passwordInput, user?.hashedPassword!)
        ).toBeTruthy()
      })
    })

    describe('422 Unprocessable Entity', () => {
      test('should reply error given password and confirmPassword not match', async () => {
        const payload = {
          firstName: 'anyFirstName',
          lastName: 'anyFirstName',
          email: 'anyuser@anyemail.com',
          password: '123456',
          confirmPassword: '654321',
        }

        const res = await app.inject({
          url: '/register/user',
          method: 'POST',
          payload: {
            ...payload,
          },
        })

        expect(res.json()).toEqual({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'Passwords must match',
          errors: {
            confirmPassword: 'Passwords must match',
          },
        })
      })

      test('should reply error given invalid email', async () => {
        const payload = {
          firstName: 'anyFirstName',
          lastName: 'anyFirstName',
          email: 'anyInvalidEmail@@anyemail.com',
          password: '123456',
          confirmPassword: '123456',
        }

        const res = await app.inject({
          url: '/register/user',
          method: 'POST',
          payload: {
            ...payload,
          },
        })

        expect(res.json()).toEqual({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: 'email must be a valid email',
          errors: {
            email: 'email must be a valid email',
          },
        })
      })

      test('should reply error given empty payload', async () => {
        const payload = {}

        const res = await app.inject({
          url: '/register/user',
          method: 'POST',
          payload: {
            ...payload,
          },
        })

        expect(res.json()).toEqual({
          statusCode: 422,
          error: 'Unprocessable Entity',
          message: '5 errors occurred',
          errors: {
            confirmPassword: 'Confirm password is required',
            email: 'Email is required',
            firstName: 'First name is required',
            lastName: 'Last name is required',
            password: 'Password is required',
          },
        })
      })
    })
  })

  describe('#GET /user/:id', () => {
    test('should return data user when exist', async () => {
      const user = {
        firstName: 'anyFirstName',
        lastName: 'anyLastName',
        email: 'anyuser@anyemail.com',
        hashedPassword: 'anyHashedPassword',
      }

      const id = 1

      await UserEntity.save(
        UserEntity.create({
          ...user,
        })
      )

      const res = await app.inject({
        url: `/user/${id}`,
        method: 'GET',
      })

      expect(res.json()).toEqual({
        data: {
          id: firstGeneratedId,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        },
      })
    })

    test('should return null when not exist', async () => {
      const notExistId = 1

      const res = await app.inject({
        url: `/user/${notExistId}`,
        method: 'GET',
      })

      expect(res.json()).toEqual({
        data: null,
      })
    })
  })
})
