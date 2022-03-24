import { FastifyPluginAsync } from 'fastify'
import sensibleService from './sensible.service'
// import * as yup from 'yup'

const routes: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/test/error', () => {
    sensibleService.errorFunction()
  })
}

export default routes
