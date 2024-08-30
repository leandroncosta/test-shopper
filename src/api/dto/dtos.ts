export type MeasureSaveRequestDto = {
  image: string,
  customer_code: string,
  measure_datetime: string,
  measure_type: string
}

export type MeasureSaveResponseDto = {
  image_url: string,
  measure_value: number,
  measure_uuid: string
}

export type MeasurePatchRequestDto = {
  measure_uuid: string,
  confirmed_value: number
}

export type MeasureMinDto = {
  measure_uuid: string,
  measure_datetime: Date,
  measure_type: string,
  has_confirmed: boolean,
  image_url: string
}


export type MeasureListResponseDto = {
  customer_code: string,
  measures: MeasureMinDto[]
}
