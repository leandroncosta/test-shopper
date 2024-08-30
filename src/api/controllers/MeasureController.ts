import { FastifyReply, FastifyRequest } from "fastify";
import { MeasureMinDto, MeasurePatchRequestDto, MeasureSaveRequestDto } from "../dto/dtos";
import { MeasureSaveResponseDto } from "../dto/dtos";
import * as MeasureService from '../services/MeasureService'


async function saveMeasureReading(req: FastifyRequest<{ Body: MeasureSaveRequestDto }>, reply: FastifyReply) {
  const data = req.body
  const { image_url, measure_value, measure_uuid } = await MeasureService.saveMeasure(data)

  const response: MeasureSaveResponseDto = {
    image_url,
    measure_value,
    measure_uuid: measure_uuid!,
  }

  return reply.status(200).send(response)
}

async function patchMeasure(req: FastifyRequest<{ Body: MeasurePatchRequestDto }>, reply: FastifyReply) {
  const data = req.body
  await MeasureService.patchMeasure(data)

  return reply.status(200).send(
    { success: true }
  )
}

type QueryParams = {
  measure_type?: string
}

async function listMeasures(req: FastifyRequest<{ Params: { customerCode: string }, Querystring: QueryParams }>, reply: FastifyReply) {
  const { customerCode } = req.params
  const { measure_type } = req?.query

  const measures: MeasureMinDto[] = await MeasureService.getMeasureReadings({
    customer_code: customerCode,
    measure_type
  })

  return reply.status(200).send({
    customer_code: customerCode,
    measures
  })
}

export {
  saveMeasureReading,
  listMeasures,
  patchMeasure
}