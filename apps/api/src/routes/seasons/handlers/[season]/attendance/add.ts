import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import { Seasons } from "../../../../../models/scoutingDB/SeasonsModel";
import seasonResponse from "../../../../../util/seasons/seasonResponse";

export default async function addAttendancePeriods({
	body: attendances,
	params: { year },
	set,
}: Context<{
	body: string[];
	params: { year: number };
}>) {
	try {
		const season = await Seasons.findOne({ year });
		if (!season) {
			set.status = 404;
			return { message: "Season not found" };
		}
		for (const attendance of attendances) {
			if (
				season.attendancePeriods.find(
					(it) =>
						it.trim().toLowerCase() ===
						attendance.trim().toLowerCase()
				)
			) {
				set.status = 400;
				return { message: "Attendance period already exists" };
			}
		}
		season.attendancePeriods.push(...attendances);
		await season.save();
		set.status = 200;
		return seasonResponse(season);
	} catch (e) {
		set.status = 500;
		await logError("Error adding attendance periods: " + e);
		return { message: "Internal server error adding attendance periods" };
	}
}
