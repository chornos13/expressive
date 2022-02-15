import fp from 'fastify-plugin'
import sensible, { SensibleOptions } from 'fastify-sensible'
import yupErrorhandler from '@src/error_handlers/yup.errorhandler'
import defaultErrorhandler from '@src/error_handlers/default.errorhandler'
import { FastifyRequest } from 'fastify/types/request'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyInstance } from 'fastify'

function withErrorFlow(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance
) {
  return function errorFlow(tasks: Function[]) {
    let index = 0

    function nextTask() {
      const task = tasks[index]
      index += 1
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      task(error, request, reply, fastify, next)
    }

    function next() {
      nextTask()
    }

    nextTask()
  }
}

/**
 * This plugins adds some utilities to handle http errors
 *
 * @see https://github.com/fastify/fastify-sensible
 */
export default fp<SensibleOptions>(async (fastify) => {
  fastify
    .register(sensible, {
      errorHandler: false,
    })
    .after(() => {
      fastify.setErrorHandler((error: Error, request, reply) => {
        const errorFlow = withErrorFlow(error, request, reply, fastify)

        errorFlow([yupErrorhandler, defaultErrorhandler])
      })
    })
})
