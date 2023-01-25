import { FastifyInstance } from "fastify";
import { dayController, habitsController, statsController } from "../controller";

export const appRouter = async (app : FastifyInstance) => {
	try {
		app.post("/habits", habitsController.createHabit);
		app.patch("/habits/:id/toggle", habitsController.updateHabit);
		app.get("/day", dayController.getDay);
		app.get("/stats", statsController.getStats);
	}
	catch (err) {
		console.log(`Router error: ${err}`);
	}
};
