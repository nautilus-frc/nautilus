import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import { Seasons } from "../../../../../models/scoutingDB/SeasonsModel";

export default async function getAttendance({
	set,
	params: { year },
}: Context<{ params: { year: number } }>) {
	try {
		const season = await Seasons.findOne({ year });
		if (!season) {
			set.status = 404;
			return { message: "Season not found" };
		}
		return season.attendancePeriods;
	} catch (e) {
		set.status = 500;
		await logError("Error getting attendance: " + e);
		return { message: "Internal server error getting attendance" };
	}
}
