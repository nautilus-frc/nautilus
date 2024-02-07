import { t } from "elysia";
import { ICrescendo } from "./Crescendo";

export const TCrescendoResponse = t.Object({
	auto: t.Object({
		leave: t.Boolean(),
		ampNotes: t.Number(),
		speakerNotes: t.Number(),
	}),
	comments: t.String(),
	competition: t.String(),
	defensive: t.Boolean(),
	matchNumber: t.Number(),
	penaltyPointsEarned: t.Number(),
	ranking: t.Object({
		melody: t.Boolean(),
		ensemble: t.Boolean(),
	}),
	rankingPoints: t.Number(),
	score: t.Number(),
	stage: t.Object({
		state: t.Union([
			t.Literal("NOT_PARKED"),
			t.Literal("PARKED"),
			t.Literal("ONSTAGE"),
			t.Literal("ONSTAGE_SPOTLIT"),
		]),
		harmony: t.Number(),
		trapNotes: t.Number(),
	}),
	teamNumber: t.Number(),
	teleop: t.Object({
		ampNotes: t.Number(),
		speakerUnamped: t.Number(),
		speakerAmped: t.Number(),
	}),
	tied: t.Boolean(),
	won: t.Boolean(),
	brokeDown: t.Boolean(),
	teamName: t.String(),
	createdAt: t.String(),
	updatedAt: t.String(),
	_id: t.String(),
	createdBy: t.String(),
} satisfies Record<keyof ICrescendoResponse, unknown>);

export type ICrescendoResponse = {
	auto: {
		leave: boolean;
		ampNotes: number;
		speakerNotes: number;
	};
	comments: string;
	competition: string;
	defensive: boolean;
	matchNumber: number;
	penaltyPointsEarned: number;
	ranking: {
		melody: boolean;
		ensemble: boolean;
	};
	rankingPoints: number;
	score: number;
	stage: {
		state: "NOT_PARKED" | "PARKED" | "ONSTAGE" | "ONSTAGE_SPOTLIT";
		harmony: number;
		trapNotes: number;
	};
	teamNumber: number;
	teleop: {
		ampNotes: number;
		speakerUnamped: number;
		speakerAmped: number;
	};
	tied: boolean;
	won: boolean;
	brokeDown: boolean;
	teamName: string;
	createdAt: string;
	updatedAt: string;
	_id: string;
	createdBy: string;
};

export const TCrescendoBody = t.Object({
	auto: t.Object({
		leave: t.Boolean(),
		ampNotes: t.Numeric(),
		speakerNotes: t.Numeric(),
	}),
	comments: t.Optional(t.String()),
	competition: t.String(),
	defensive: t.Boolean(),
	matchNumber: t.Numeric(),
	penaltyPointsEarned: t.Numeric(),
	ranking: t.Object({
		melody: t.Boolean(),
		ensemble: t.Boolean(),
	}),
	rankingPoints: t.Numeric(),
	score: t.Numeric(),
	stage: t.Object({
		state: t.Union([
			t.Literal("NOT_PARKED"),
			t.Literal("PARKED"),
			t.Literal("ONSTAGE"),
			t.Literal("ONSTAGE_SPOTLIT"),
		]),
		harmony: t.Numeric(),
		trapNotes: t.Numeric(),
	}),
	teamNumber: t.Numeric(),
	teleop: t.Object({
		ampNotes: t.Numeric(),
		speakerUnamped: t.Numeric(),
		speakerAmped: t.Numeric(),
	}),
	tied: t.Boolean(),
	won: t.Boolean(),
	brokeDown: t.Boolean(),
} satisfies Record<keyof ICrescendoBody, unknown>);

export type ICrescendoBody = {
	auto: {
		leave: boolean;
		ampNotes: number;
		speakerNotes: number;
	};
	comments?: string;
	competition: string;
	defensive: boolean;
	matchNumber: number;
	penaltyPointsEarned: number;
	ranking: {
		melody: boolean;
		ensemble: boolean;
	};
	rankingPoints: number;
	score: number;
	stage: {
		state: "NOT_PARKED" | "PARKED" | "ONSTAGE" | "ONSTAGE_SPOTLIT";
		harmony: number;
		trapNotes: number;
	};
	teamNumber: number;
	teleop: {
		ampNotes: number;
		speakerUnamped: number;
		speakerAmped: number;
	};
	tied: boolean;
	won: boolean;
	brokeDown: boolean;
};
