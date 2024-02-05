import { Context } from "elysia";
import { logError } from "../../../../../util/general/logging";
import { Seasons } from "../../../../../models/scoutingDB/SeasonsModel";
import seasonResponse from "../../../../../util/seasons/seasonResponse";

export default async function removeCompetition({
	set,
	params: { year },
	body: competitions,
}: Context<{
	params: {
		year: number;
	};
	body: string[];
}>) {
	try {
		const season = await Seasons.findOne({ year });
		if (!season) {
			set.status = 404;
			return { message: "Season not found" };
		}
		const newCompetitions = season.competitions.filter(
			(it) => !competitions.includes(it)
		);
		season.competitions = newCompetitions;
		const updated = await season.save();
		set.status = 200;
		return seasonResponse(updated);
	} catch (e) {
		set.status = 500;
		await logError("Error removing competition: " + e);
		return { message: "Internal server error removing competition" };
	}
}
