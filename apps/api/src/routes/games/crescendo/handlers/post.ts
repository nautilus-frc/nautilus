import { Context } from "elysia";
import { User } from "../../../../models/usersDB/users/UserModel";
import { ICrescendoBody } from "../../../../models/scoutingDB/games/crescendo/elysiamodels";
import { logError, logSuccess } from "../../../../util/general/logging";
import { getTeamName } from "../../../../util/scouting/tba";
import { Crescendos } from "../../../../models/scoutingDB/games/crescendo/Crescendo";
import crescendoResponse from "../util/format";

export default async function submitCrescendo(
	user: User,
	{
		body,
		set,
	}: Context<{
		body: ICrescendoBody;
	}>
) {
	try {
		const teamname = await getTeamName(body.teamNumber);
		const data = await Crescendos.create({
			...body,
			createdBy: user._id,
			comments: `${body.comments}`,
			teamName: teamname,
		});
		if (!data) {
			set.status = 500;
			return {
				message: "Internal server error submitting scouting form",
			};
		}
		await logSuccess(
			"Scouting form submitted: " +
				data._id.toString() +
				" by " +
				user._id.toString()
		);
		set.status = 200;
		return crescendoResponse(data);
	} catch (e) {
		set.status = 500;
		await logError("Error submitting scouting form: " + e);
		return { message: "Internal server error submitting scouting form" };
	}
}
