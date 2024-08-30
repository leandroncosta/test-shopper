import { app } from "../../app";

import * as MeasureController from '../controllers/MeasureController'

async function MeasureRoutes() {
  app.post("/upload", MeasureController.saveMeasureReading)
  app.patch("/confirm", MeasureController.patchMeasure)
  app.get("/:customerCode/list", MeasureController.listMeasures)
}


export {
  MeasureRoutes
}