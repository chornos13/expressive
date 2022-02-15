import { FastifyPluginAsync } from 'fastify'
import { waterfall } from 'async'
import { InferType } from 'yup'
import UserEntity from './user.entity'
import userSchema from './user.schema'

const { registerSchema } = userSchema

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.post('/register/user', (req, reply) => {
    waterfall(
      [
        async function validatePayload() {
          const payload = await registerSchema.validate(req.body, {
            abortEarly: false,
          })

          return payload
        },
        async function createEntity(payload: InferType<typeof registerSchema>) {
          const entity = UserEntity.create({
            ...payload,
            hashedPassword: await fastify.bcrypt.hash(payload.password),
          })

          return entity
        },
        async function insertUser(userEntity: UserEntity) {
          const data = await UserEntity.save(userEntity)

          // @ts-ignore
          delete data.hashedPassword

          return data
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

  fastify.get('/user/:id', (req, reply) => {
    waterfall(
      [
        async function getUser() {
          const { id } = req.params as any
          const user = await UserEntity.findOne(id)

          if (user) {
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

export default example
