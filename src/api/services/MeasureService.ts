import path from 'node:path'
import fs from "node:fs"

import { InvalidRequestException } from "../../core/exceptions/InvalidRequestException"
import { ReadingAlreadyExistsException } from "../../core/exceptions/ReadingAlreadyExistsException"
import { createMeasureMinDto, generateFileName, isBase64, isValidBody } from "../../core/utils/utils"
import { ReadingNotFoundException } from "../../core/exceptions/ReadingNotFoundException"
import { MeasureMinDto, MeasurePatchRequestDto, MeasureSaveRequestDto } from "../dto/dtos"
import { Measure, MeasureType } from "../../core/interfaces/interfaces"
import { getImageDescriptionFromGemini } from './GeminiService'
import * as MeasureRepository from '../repositories/MeasureRepository'


const uploadPath = path.resolve(__dirname, "../../public/uploads")


async function saveMeasure(data: MeasureSaveRequestDto): Promise<Measure> {
  const { image, customer_code, measure_datetime, measure_type } = data

  if (!isValidBody(data))
    throw new InvalidRequestException("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA")

  if (!isBase64(image))
    throw new InvalidRequestException("Invalid image base64", "INVALID_DATA")


  const measures = await MeasureRepository.getAllByCustomerCode(customer_code)
  const alreadyHaveReading = measures
    .some(measure => (new Date(measure.measure_datetime).getMonth() === new Date(measure_datetime).getMonth()) && measure.measure_type === measure_type)

  if (alreadyHaveReading)
    throw new ReadingAlreadyExistsException("Leitura do mês já realizada", "DOUBLE_REPORT")


  const fileName = generateFileName()
  const imageValue = await getImageDescriptionFromGemini(fileName, image)

  const measure: Measure = await MeasureRepository.save({
    image_url: `http://localhost:${process.env.PORT}/uploads/${fileName}`,
    customer_code,
    measure_datetime: new Date(measure_datetime),
    has_confirmed: false,
    measure_type: measure_type as MeasureType,
    measure_value: Number(imageValue) || 0
  })

  //upload caso salve no bd e tudo ok
  if (measure) {
    const base64Data = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const filePathDestionation = path.join(uploadPath, fileName);

    fs.writeFileSync(filePathDestionation, buffer);
  }

  return measure;
}

async function patchMeasure(data: MeasurePatchRequestDto): Promise<void> {
  const { confirmed_value, measure_uuid } = data

  if (typeof measure_uuid !== 'string' || measure_uuid.trim() === "" || typeof confirmed_value !== "number" || confirmed_value == null) {
    throw new InvalidRequestException("Os dados fornecidos no corpo da requisição são inválidos", "INVALID_DATA")
  }

  let measure = await MeasureRepository.getByUUID(measure_uuid)

  if (measure == null) throw new ReadingNotFoundException("Leitura não encontrada", "MEASURE_NOT_FOUND")

  if (measure.has_confirmed) throw new ReadingAlreadyExistsException("Leitura do mês já realizada", "CONFIRMATION_DUPLICATE")

  await MeasureRepository.updateByUUID(measure_uuid, {
    measure_value: confirmed_value,
    has_confirmed: true
  } as Measure)
}

async function getMeasureReadings(data: { measure_type?: string, customer_code: string }): Promise<MeasureMinDto[]> {

  if (data.measure_type !== undefined && !(data.measure_type === MeasureType.WATER || data.measure_type === MeasureType.GAS)) {
    throw new InvalidRequestException("Tipo de medição não permitida", "INVALID_TYPE")
  }

  const measures: Measure[] = await MeasureRepository.getAllByCustomerCode(data.customer_code, data.measure_type)
  if (measures.length == 0) {
    throw new ReadingNotFoundException("Nenhuma leitura encontrada", "MEASURES_NOT_FOUND")
  }

  return measures.map(m => createMeasureMinDto(m))
}


export {
  saveMeasure,
  patchMeasure,
  getMeasureReadings
}