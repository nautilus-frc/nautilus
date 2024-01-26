import { Elysia } from "elysia";
import { scoutingDB, usersDB } from "./config/db";
import { User } from "./models/usersDB/UserModel";
import json, { message } from "./util/json";
import { cors } from "@elysiajs/cors";
import { getRoot } from "./routes/root";
import { PROTECTION_LEVEL, protect } from "./util/protect";
import { getMe } from "./routes/users/getMe";

const PORT = process.env.PORT || 3001;

scoutingDB.on("connected", () => {
	console.log("Connected to scoutingDB: " + scoutingDB.host);
});

usersDB.on("connected", () => {
	console.log("Connected to usersDB: " + usersDB.host);
});

export const app = new Elysia().use(cors());

app.get(
	"/",
	async (ctx) => await protect(PROTECTION_LEVEL.ADMIN, ctx, getRoot)
);

app.get(
	"/users/me",
	async (ctx) => await protect(PROTECTION_LEVEL.NONE, ctx, getMe)
);

app.listen(PORT);
