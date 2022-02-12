import { FastifyPluginAsync } from 'fastify'
import User from '../entity/User'

const example: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/user', async () => {
    const { orm } = fastify
    const repository = orm.getRepository(User)

    const user = new User()
    user.firstName = 'Timber'
    user.lastName = 'Saw'
    user.isActive = false
    await repository.save(user)

    return {
      user,
    }
  })
}

export default example
