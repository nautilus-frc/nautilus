import { logError } from "../general/logging";

const TBA_KEY = process.env.TBA_KEY;

/**
 * Looks up the team name for an FRC team number using the Blue Alliance API.
 * Requires TBA_KEY environment variable to be set.
 * @param teamNumber Team number to look up team name for
 * @returns {Promise<string>} Team name, or "unknown" if not found
 */
export async function getTeamName(teamNumber: number): Promise<string> {
	if (!TBA_KEY) {
		logError("TBA key not found");
		return "unknown";
	}
	const res = await fetch(
		"https://www.thebluealliance.com/api/v3/team/frc" + teamNumber,
		{ method: "GET", headers: { "X-TBA-Auth-Key": TBA_KEY } }
	);
	if (res.ok) {
		const json = await res.json();
		return json.nickname ?? "unknown";
	}
	return "unknown";
}
