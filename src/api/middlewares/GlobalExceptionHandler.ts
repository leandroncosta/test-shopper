import { FastifyReply, FastifyRequest } from "fastify";
import { InvalidRequestException } from "../../core/exceptions/InvalidRequestException";
import { ReadingAlreadyExistsException } from "../../core/exceptions/ReadingAlreadyExistsException";
import { ReadingNotFoundException } from "../../core/exceptions/ReadingNotFoundException";

export function errorHandler(error: Error, req: FastifyRequest, reply: FastifyReply) {

  if (error instanceof InvalidRequestException) {
    return reply.status(400).send({
      error_code: error.error,
      error_description: error.message
    })
  }

  if (error instanceof ReadingAlreadyExistsException) {
    return reply.status(409).send({
      error_code: error.error,
      error_description: error.message
    })
  }

  if (error instanceof ReadingNotFoundException) {
    return reply.status(404).send({
      error_code: error.error,
      error_description: error.message
    })
  }

  return reply.status(500).send({
    error_code: 'Internal Server Error',
    message: error.message
  });
}