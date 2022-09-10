import { FastifyPluginAsync } from 'fastify'
import { waterfall } from 'async'
import UserEntity from '@src/entity/user'

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/login', (req, reply) => {
    const { email, password } = req.body as any
    waterfall(
      [
        async function getUser() {
          const user = await UserEntity.findOne({
            where: {
              email,
            },
          })

          if (!user) {
            throw fastify.httpErrors.unauthorized(
              'Email or password is incorrect'
            )
          }

          return user
        },
        async function validatePassword(user: UserEntity) {
          const isCorrect = await fastify.bcrypt.compare(
            password,
            user.hashedPassword
          )

          if (!isCorrect) {
            throw fastify.httpErrors.unauthorized(
              'Email or password is incorrect'
            )
          }

          return user
        },
        async function getToken(user: UserEntity) {
          const { id } = user

          return fastify.jwt.sign({
            user: {
              id,
            },
          })
        },
      ],
      (err, token?: string) => {
        if (err || !token) return reply.send(err)

        const date = new Date()
        date.setHours(date.getHours() + 2)

        reply.setCookie('token', token, {
          domain: process.env.COOKIES_DOMAIN,
          path: '/',
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          expires: date,
        })

        return reply.send({
          statusCode: 200,
          message: 'Login successfully',
          data: {
            token,
          },
        })
      }
    )
  })
}

export default routes
