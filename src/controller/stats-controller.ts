import { FastifyRequest, FastifyReply } from "fastify";
import { prisma } from "../lib/prisma";

const statsController = {
	getStats: async (req: FastifyRequest, res: FastifyReply) => {
		const stats = await prisma.$queryRaw`
			SELECT
				D.id,
				D.date,
			(
				SELECT
					cast(count(*) as float)
				FROM
					day_habit DH
				WHERE
					DH.day_id = D.id
			) as completed,
			(
				SELECT
					cast(count(*) as float)
				FROM habit_week_days HWD
				JOIN habits H
					ON H.id = HWD.habit_id
				WHERE
					HWD.week_day = cast(strftime("%w", D.date/1000.0, "unixepoch") as int)
					AND H.created_at <= D.date
			) as amount
			FROM days D
		`;
		res.send(stats);
	}
};

export default statsController;