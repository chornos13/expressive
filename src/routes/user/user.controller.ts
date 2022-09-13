import { FastifyPluginAsync } from 'fastify'
import { waterfall } from 'async'
import { InferType } from 'yup'
import userSchema from '@src/routes/user/user.schema'
import UserEntity from '@src/entity/user'
import userService from './user.service'

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/register/user', async (req, reply) => {
    const data = await userService.postRegisterUser(
      req.body as InferType<typeof userSchema.registerSchema>,
      fastify.bcrypt.hash
    )

    reply.send(data)
  })

  fastify.get('/user/:id', (req, reply) => {
    waterfall(
      [
        async function getUser() {
          const { id } = req.params as any
          const user = await UserEntity.findOneBy({
            id,
          })

          if (user) {
            // @ts-ignore
            delete user.hashedPassword
          }

          return user || null
        },
      ],
      (err, user) => {
        if (err) {
          return reply.send(err)
        }

        return reply.send({
          data: user,
        })
      }
    )
  })
}

export default routes
