import { t } from "elysia";

export const TServerMessage = t.Object({ message: t.String() });

export const TAuthHeaders = t.Object(
	{
		authorization: t.String(),
	},
	{
		error: "JWT Bearer token required for authorization",
	}
);
