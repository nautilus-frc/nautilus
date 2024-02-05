import { Context } from "elysia";
import { Seasons } from "../../../models/scoutingDB/SeasonsModel";
import seasonResponse from "../../../util/seasons/seasonResponse";
import { logError } from "../../../util/general/logging";

export default async function createSeason({
	body,
	set,
}: Context<{
	body: {
		year: number;
		name: string;
		competitions: string[];
		attendancePeriods: string[];
	};
}>) {
	try {
		if (await Seasons.findOne({ year: body.year })) {
			set.status = 400;
			return { message: "Season already exists" };
		}
		const season = await Seasons.create({
			year: body.year,
			name: body.name,
			competitions: body.competitions,
			attendancePeriods: body.attendancePeriods,
		});
		if (!season) {
			set.status = 500;
			return { message: "Internal server error creating season" };
		}
		return seasonResponse(season);
	} catch (e) {
		await logError("Error creating season: " + e);
		set.status = 500;
		return { message: "Internal server error creating season" };
	}
}
