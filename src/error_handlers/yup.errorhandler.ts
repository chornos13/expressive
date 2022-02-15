import { ValidationError } from 'yup'
import { FastifyRequest } from 'fastify/types/request'
import { FastifyReply } from 'fastify/types/reply'
import { FastifyInstance } from 'fastify'

function yupErrorhandler(
  error: Error,
  request: FastifyRequest,
  reply: FastifyReply,
  fastify: FastifyInstance,
  next: () => void
) {
  if (error instanceof ValidationError) {
    const errors =
      error.inner.length > 0
        ? error.inner.reduce<{ [key: string]: string }>(
            (acc: any, curVal: any) => {
              acc[`${curVal.path}`] = curVal.message || curVal.type
              return acc
            },
            {}
          )
        : { [`${error.path}`]: error.message || error.type }

    reply.status(422).send({
      statusCode: 422,
      message: error.message,
      error: 'Unprocessable Entity',
      errors,
    })

    return
  }

  next()
}

export default yupErrorhandler
