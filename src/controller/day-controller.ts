import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import dayjs from "dayjs";
import { prisma } from "../lib/prisma";

const dayController = {
	getDay: async (req: FastifyRequest, res: FastifyReply) => {
		const getDaysParams = z.object({
			date: z.coerce.date()
		});
		const { date } = getDaysParams.parse(req.query);
		const parsedDate = dayjs(date).startOf("day");
		const weekDay = parsedDate.get("day");

		try {
			const possibleHabits = await prisma.habit.findMany({
				where: {
					created_at: {
						lte: date
					},
					weekDays: {
						some: {
							week_day: weekDay
						}
					}
				}
			});
			const day = await prisma.day.findUnique({
				where: {
					date: parsedDate.toDate()
				},
				include: {
					dayHabits: true
				}
			});
			const completedHabits = day?.dayHabits.map(({ habit_id }) => habit_id);

			res.status(200).send({ possibleHabits, completedHabits });
		}
		catch (err){
			res.status(400).send(err);
		}
	}
};


export default dayController;