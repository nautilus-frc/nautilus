import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import { Seasons } from "../../../../../models/scoutingDB/SeasonsModel";
import seasonResponse from "../../../../../util/seasons/seasonResponse";

export default async function addCompetition({
	set,
	body: competitions,
	params: { year },
}: Context<{ params: { year: number }; body: string[] }>) {
	try {
		const season = await Seasons.findOne({ year });
		if (!season) {
			set.status = 404;
			return { message: "Season not found" };
		}
		for (const competition of competitions) {
			if (
				season.competitions.find(
					(it) =>
						it.trim().toLowerCase() ===
						competition.trim().toLowerCase()
				)
			) {
				set.status = 400;
				return {
					message: "Competition " + competition + "  already exists",
				};
			}
		}
		season.competitions.push(...competitions);
		const updated = await season.save();
		set.status = 200;
		return seasonResponse(updated);
	} catch (e) {
		set.status = 500;
		await logError("Error adding competition: " + e);
		return { message: "Internal server error adding competition" };
	}
}
