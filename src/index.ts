import fastify from "fastify"
import cors from "@fastify/cors"
import { appRouter } from "./router"

const port = 4444
const app = fastify()

try {
	app.register(cors)
	app.register(appRouter)
	app.listen({ port }).then(() => console.log(`Running on http://localhost:${port} ✅`))
}
catch (err) {
	console.log(`Startup error: ${err} ❌`)
}