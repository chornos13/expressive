import { FastifyPluginAsync } from 'fastify'
import { waterfall } from 'async'
import UserEntity from '@src/routes/user/user.entity'

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
        if (err) return reply.send(err)

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
