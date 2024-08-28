import fastify from "fastify";
import cors from "@fastify/cors";
import formBody from '@fastify/formbody'
import { uploadRoutes } from "./api/routes/upload-file";

const app = fastify()

const corsOptions = {
  credentials: false,
  origin: /localhost\:5173/
}

app.register(cors, corsOptions)
app.register(formBody)
app.register(uploadRoutes)

export {
  app
}