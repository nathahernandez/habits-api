import { FastifyRequest, FastifyReply } from "fastify";
import { z } from "zod";
import dayjs from "dayjs";

import { prisma } from "../lib/prisma";

const controllers = {
	habits: {
		post: async (req: FastifyRequest, res: FastifyReply) => {

			const createHabitBody = z.object({
				title: z.string(),
				weekDays: z.array(z.number().min(0).max(6))
			});
			const today = dayjs().startOf("day").toDate();
			const { title, weekDays } = createHabitBody.parse(req.body);

			await prisma.habit
				.create({
					data: {
						title,
						created_at: new Date(today),
						weekDays: {
							create: weekDays.map(day => {
								return {
									week_day: day
								};
							})
						}
					}
				})
				.then(habit => res.status(201).send(JSON.stringify(habit)))
				.catch(err => res.send(400).send(JSON.stringify(err)));
		}
	},
	day: {
		get: async (req: FastifyRequest, res: FastifyReply) => {
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
	}
};


export default controllers;