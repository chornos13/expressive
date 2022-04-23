import { FastifyInstance } from 'fastify'
import userService from '@src/routes/user/user.service'

const userPayload = {
  firstName: 'anyFirstName',
  lastName: 'anyLastName',
  email: 'anyemail@email.com',
  password: 'anypassword',
  confirmPassword: 'anypassword',
}

function setupCreateDummyUser(
  bcryptHash: () => (pwd: string) => Promise<string>
) {
  beforeAll(async () => {
    await userService.postRegisterUser(userPayload, bcryptHash())
  })

  return userPayload
}

async function loginPost(
  app: FastifyInstance,
  email: string,
  password: string
) {
  return app.inject({
    url: '/login',
    method: 'POST',
    payload: {
      email,
      password,
    },
  })
}

const loginHelper = {
  setupCreateDummyUser,
  loginPost,
  userPayload,
}

export default loginHelper
