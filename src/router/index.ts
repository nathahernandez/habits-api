import { FastifyInstance } from "fastify";
import controllers from "../controllers";

export const appRouter = async (app : FastifyInstance) => {
	try {
		app.post("/habits", controllers.habits.post);
		app.get("/day", controllers.day.get);
	}
	catch (err) {
		console.log(`Router error: ${err}`);
	}
};
