import { t } from "elysia";

export const TSeason = t.Object({
	year: t.Number(),
	name: t.String(),
	competitions: t.Array(t.String()),
	attendancePeriods: t.Array(t.String()),
});
