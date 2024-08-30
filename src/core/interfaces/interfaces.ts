export enum MeasureType {
  WATER = "WATER",
  GAS = "GAS"
}

export interface Measure {
  measure_uuid?: string,
  image_url: string,
  customer_code: string,
  measure_datetime: Date,
  measure_type: "WATER" | "GAS",
  has_confirmed: boolean,
  measure_value: number,
}

