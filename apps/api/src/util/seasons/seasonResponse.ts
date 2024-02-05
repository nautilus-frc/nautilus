import { Season } from "../../models/scoutingDB/SeasonsModel";

export default function seasonResponse(s: Season) {
	return {
		year: s.year,
		name: s.name,
		competitions: s.competitions,
		attendancePeriods: s.attendancePeriods,
	};
}
