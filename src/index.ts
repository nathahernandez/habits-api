import fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const port = 4444;
const app = fastify();
const prisma = new PrismaClient();

app.register(cors);

app.get("/", async () => {
	const habits = await prisma.habit.findMany();
	return habits;
});

try {
	app.listen({ port }).then(() => console.log(`Running on http://localhost:${port}`));
}
catch (err) {
	console.log(`Erro: ${err}`);
}