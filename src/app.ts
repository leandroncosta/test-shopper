import path from "node:path";
import fastify from "fastify";
import cors from "@fastify/cors";
import formBody from '@fastify/formbody'
import fastifyStatic from '@fastify/static'
import { MeasureRoutes } from "./api/routes/MeasureRoutes";
import { corsOptions } from "./api/config/corsConfig";
import { errorHandler } from "./api/middlewares/GlobalExceptionHandler";


const app = fastify({
  logger: true
})

app.register(fastifyStatic, {
  root: path.join(__dirname, "public/uploads"),
  prefix: "/uploads/"
})

app.register(cors, corsOptions)
app.register(formBody)
app.setErrorHandler(errorHandler)
app.register(MeasureRoutes)

export {
  app
}