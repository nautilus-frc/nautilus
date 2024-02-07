import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import { Seasons } from "../../../../../models/scoutingDB/SeasonsModel";

export default async function getComps({
	set,
	params: { year },
}: Context<{ params: { year: number } }>) {
	try {
		const season = await Seasons.findOne({ year });
		if (!season) {
			set.status = 404;
			return { message: "Season not found" };
		}
		return season.competitions;
	} catch (e) {
		set.status = 500;
		await logError("Error getting competitions: " + e);
		return { message: "Internal server error getting competitions" };
	}
}
