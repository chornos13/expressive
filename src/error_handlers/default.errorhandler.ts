import { FastifyRequest } from 'fastify/types/request'
import { FastifyReply } from 'fastify/types/reply'

function defaultErrorHandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  reply.send(error)
}

export default defaultErrorHandler
