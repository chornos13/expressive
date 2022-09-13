import { waterfall } from 'async'
import { InferType } from 'yup'
import UserEntity from '@src/entity/user'
import userSchema from '@src/routes/user/user.schema'

const { registerSchema } = userSchema

function postRegisterUser(
  body: InferType<typeof userSchema.registerSchema>,
  hashFn: (pwd: string) => Promise<string>
) {
  return new Promise((resolve, reject) => {
    waterfall(
      [
        async function validatePayload() {
          const payload = await registerSchema.validate(body, {
            abortEarly: false,
          })

          return payload
        },
        async function createEntity(payload: InferType<typeof registerSchema>) {
          const entity = UserEntity.create({
            ...payload,
            hashedPassword: await hashFn(payload.password),
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
      (err, user: UserEntity | undefined) => {
        if (err) {
          return reject(err)
        }

        return resolve({
          data: user,
        })
      }
    )
  })
}

export default {
  postRegisterUser,
}
