import { app } from "./app"

const PORT = Number(process.env.PORT) || 3333

app.listen({ port: PORT }).then(() => {
  console.log(`HTTP server running port ${PORT}`)
})