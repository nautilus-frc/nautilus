import { Crescendo } from "../../../../models/scoutingDB/games/crescendo/Crescendo";
import { ICrescendoResponse } from "../../../../models/scoutingDB/games/crescendo/elysiamodels";

export default function crescendoResponse(data: Crescendo): ICrescendoResponse {
	return {
		_id: data._id.toString(),
		auto: {
			leave: data.auto.leave,
			ampNotes: data.auto.ampNotes,
			speakerNotes: data.auto.speakerNotes,
		},
		brokeDown: data.brokeDown,
		comments: data.comments ?? "",
		competition: data.competition,
		createdAt: data.createdAt.toISOString(),
		defensive: data.defensive,
		matchNumber: data.matchNumber,
		penaltyPointsEarned: data.penaltyPointsEarned,
		ranking: {
			melody: data.ranking.melody,
			ensemble: data.ranking.ensemble,
		},
		rankingPoints: data.rankingPoints,
		score: data.score,
		stage: {
			state: (() => {
				switch (data.stage.state) {
					case "NOT_PARKED":
						return "NOT_PARKED";
					case "PARKED":
						return "PARKED";
					case "ONSTAGE":
						return "ONSTAGE";
					case "ONSTAGE_SPOTLIT":
						return "ONSTAGE_SPOTLIT";
					default:
						return "NOT_PARKED";
				}
			})(),
			harmony: data.stage.harmony,
			trapNotes: data.stage.trapNotes,
		},
		createdBy: data.createdBy.toString(),
		teamNumber: data.teamNumber,
		teamName: data.teamName,
		teleop: {
			ampNotes: data.teleop.ampNotes,
			speakerUnamped: data.teleop.speakerUnamped,
			speakerAmped: data.teleop.speakerAmped,
		},
		tied: data.tied,
		updatedAt: data.updatedAt.toISOString(),
		won: data.won,
	};
}
