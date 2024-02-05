import { Context } from "elysia";
import { logError } from "../../../../util/general/logging";
import { Seasons } from "../../../../models/scoutingDB/SeasonsModel";
import seasonResponse from "../../../../util/seasons/seasonResponse";

export default async function updateSeason({
	set,
	body,
	params: { year },
}: Context<{
	params: { year: number };
	body: {
		year?: number;
		name?: string;
		competitions?: string[];
		attendancePeriods?: string[];
	};
}>) {
	try {
		const updated = await Seasons.findOneAndUpdate(
			{ year },
			{ ...body },
			{
				new: true,
			}
		);
		if (!updated) {
			set.status = 404;
			return { message: "Season not found" };
		}
		set.status = 200;
		return seasonResponse(updated);
	} catch (e) {
		set.status = 500;
		await logError("Error updating season: " + e);
		return { message: "Internal server error updating season" };
	}
}
