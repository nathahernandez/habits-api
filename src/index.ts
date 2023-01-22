import fastify from "fastify";

const port = 4444;
const app = fastify();

app.get("/", () => {
	return "Hello World";
});

try {
	app.listen({ port }).then(() => console.log(`Running on http://localhost:${port}`));
}
catch (err) {
	console.log(`Erro: ${err}`);
}