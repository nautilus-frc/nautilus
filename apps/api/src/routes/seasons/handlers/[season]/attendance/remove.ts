import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import { Seasons } from "../../../../../models/scoutingDB/SeasonsModel";
import seasonResponse from "../../../../../util/seasons/seasonResponse";

export default async function removeAttendancePeriods({
	body: attendances,
	params: { year },
	set,
}: Context<{ body: string[]; params: { year: number } }>) {
	try {
		const season = await Seasons.findOne({ year });
		if (!season) {
			set.status = 404;
			return { message: "Season not found" };
		}
		season.attendancePeriods = season.attendancePeriods.filter(
			(period) => !attendances.includes(period)
		);
		const updated = await season.save();
		set.status = 200;
		return seasonResponse(updated);
	} catch (e) {
		set.status = 500;
		await logError("Error removing attendance: " + e);
		return { message: "Internal server error removing attendance" };
	}
}
