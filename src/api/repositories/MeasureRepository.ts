import { Measure } from "../../core/interfaces/interfaces";
import { prisma } from "../config/database";


async function save(measureData: Measure): Promise<Measure> {
  try {
    return await prisma.measure.create({
      data: measureData,
    }) as Measure

  } catch (error) {
    console.error('Error saving measure: ', error);
    throw error
  }
}

async function getAllByCustomerCode(customer_code: string, measure_type?: string): Promise<Measure[]> {
  try {
    let whereCondition: object = {
      customer_code
    }

    if (measure_type) {
      whereCondition = {
        ...whereCondition,
        measure_type
      }
    }

    return await prisma.measure.findMany({
      where: whereCondition
    }) as Measure[]

  } catch (error) {
    console.error('Error finding measures: ', error);
    throw error
  }
}

async function getByUUID(uuid: string): Promise<Measure | null> {
  try {
    return await prisma.measure.findUnique({
      where: {
        measure_uuid: uuid
      }
    }) as Measure | null
  } catch (error) {
    console.error('Error finding measure:', error);
    throw error
  }
}

async function updateByUUID(uuid: string, measure: Measure): Promise<void> {
  try {
    await prisma.measure.update({
      data: {
        ...measure
      },
      where: {
        measure_uuid: uuid
      }
    })
  } catch (error) {
    console.error('Error updating measure:', error);
    throw error
  }
}

export {
  save,
  getAllByCustomerCode,
  getByUUID,
  updateByUUID
}