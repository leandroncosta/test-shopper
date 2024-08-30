import { randomUUID } from "node:crypto";
import { MeasureMinDto, MeasureSaveRequestDto } from "../../api/dto/dtos";
import { Measure, MeasureType } from "../interfaces/interfaces";


const isBase64 = (str: string): boolean => {
  if (typeof str !== 'string') return false
  if (str.length % 4 !== 0) return false

  const base64Regex = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  return base64Regex.test(str)
}

const isValidBody = (body: MeasureSaveRequestDto): boolean => {
  if (typeof body.image !== 'string' || body.image.trim() === "" || typeof body.customer_code !== 'string' || body.customer_code.trim() === "" || typeof body.measure_datetime !== "string" || !isValidDate(body.measure_datetime) || (body.measure_type !== MeasureType.WATER && body.measure_type !== MeasureType.GAS)) {
    return false;
  }
  return true
}

function verifyBody(body: unknown): body is MeasureSaveRequestDto {
  if (body && typeof body === "object" && "image" in body && "customer_code" in body && "measure_datetime" in body && "measure_type" in body) {
    return true
  } else {
    return false
  }
}

const isValidDate = (data: string): boolean => {
  const date = new Date(data)
  const isValid = !isNaN(date.getTime())

  return isValid;
}

const createMeasureMinDto = (measure: Measure): MeasureMinDto => {
  const { measure_uuid, measure_datetime, measure_type, has_confirmed, image_url } = measure

  return {
    measure_uuid: String(measure_uuid),
    measure_datetime,
    measure_type,
    has_confirmed,
    image_url,
  }
}

const generateFileName = () => {
  const now = new Date()

  const datePart = `${now.getDate().toString().padStart(2, '0')}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getFullYear()}`
  const timePart = `${now.getHours().toString().padStart(2, '0')}-${now.getMinutes().toString().padStart(2, '0')}-${now.getSeconds().toString().padStart(2, '0')}`
  return `image-${datePart}-${timePart}${randomUUID()}.png`
}


export {
  isBase64,
  isValidBody,
  verifyBody,
  createMeasureMinDto,
  generateFileName
}