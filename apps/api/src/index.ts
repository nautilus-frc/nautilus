import { cors } from "@elysiajs/cors";
import { isHtml } from "@elysiajs/html";
import { swagger } from "@elysiajs/swagger";
import { Elysia } from "elysia";
import { scoutingDB, usersDB } from "./config/db";
import { usersRouter } from "./routes/users/userRouter";
import json, { isJson, message } from "./util/json";
import { log, logError, logSuccess } from "./util/logging";
import { htmlPreview } from "./components/htmlPreview";
import "@kitajs/html/register";
import staticPlugin from "@elysiajs/static";
import { htmxRouter } from "./htmx/HtmxRouter";
import { TServerMessage } from "./models/global/ElysiaModels";
import bearer from "@elysiajs/bearer";

const PORT = process.env.PORT || 3001;

scoutingDB.on("connected", () => {
	logSuccess("Connected to scoutingDB: " + scoutingDB.host);
});
scoutingDB.on("error", () => {
	logError("Error connecting to scoutingDB: " + scoutingDB.host);
});

usersDB.on("connected", () => {
	logSuccess("Connected to usersDB: " + usersDB.host);
});
usersDB.on("error", () => {
	logError("Error connecting to usersDB: " + usersDB.host);
});

const _ = new Elysia()
	.use(cors())
	.use(
		swagger({
			exclude: [
				//exclude all htmx pages under /pages
				/^\/pages.*/gm,
				/\/pages\/(.*)/,
				/\/preview/,
				/\/preview\/(.*)/,
			],
			documentation: {
				info: {
					title: "Nautilus API",
					description: "Backend API for Nautilus FRC",
					version: "0.0.1-experimental",
				},
				tags: [
					{
						name: "Users",
						description: "User account related endpoints",
					},
				],
			},
		})
	)
	.use(staticPlugin({ prefix: "/" }))
	.onParse(async ({ body, request }, contentType) => {
		if (contentType === "application/json") return body;
		else if (contentType === "application/x-www-form-urlencoded") {
			const obj: Record<string, unknown> = {};
			const bodyStr = await request.text();
			const pairs = bodyStr.split("&");
			for (const pair of pairs) {
				const [key, value] = pair.split("=");
				obj[key] = decodeURIComponent(value);
			}
			return JSON.parse(JSON.stringify(obj));
		}
	})
	.derive(({ request }) => {
		const ip = request.headers.get("X-Real-IP"); //filled in by nginx
		return { ip };
	})
	.onBeforeHandle(({ request, path, params, body, query, ip }) => {
		//logging
		let str = `Recieved ${request.method} request ${ip ? "from " + ip : ""} at ${path}`;
		if (params)
			str += ` with params ${JSON.stringify(params, undefined, 2)}`;
		if (body) str += ` with body ${JSON.stringify(body)}`;
		if (Object.keys(query).length > 0)
			str += ` with query ${json({ ...query })}`;
		log(str);
	})
	.onAfterHandle(async ({ response, path, set, request, ip }) => {
		//content type
		const res = (await response) as string;
		if (isHtml(res)) {
			set.headers["Content-Type"] = "text/html";
		} else if (isJson(res)) {
			set.headers["Content-Type"] = "application/json";
		}
		//logging
		const status = set?.status;
		let str = `Responded to ${request.method} request ${ip ? "from " + ip : ""} at ${path} with status ${status}`;
		if (Number(status) < 400) {
			log(str);
		} else {
			logError(str);
		}
	})
	.onError(({ error, path, request, set, code }) => {
		set.headers["Content-Type"] = "application/json";
		let mes = `${error.name} fulfilling ${request.method} at ${path}: ${error.message}`;
		if (error.cause) mes += `Caused by: ${error.cause}`;
		if (error.stack) mes += `\nStacktrace: \n${error.stack}`;
		logError(mes);

		switch (code) {
			case "VALIDATION":
				set.status = 400;
				return message("Please fill in all fields properly");
			case "INTERNAL_SERVER_ERROR":
				set.status = 500;
				return message("Internal server error");
			case "NOT_FOUND":
				set.status = 404;
				return message("Not found");
			case "INVALID_COOKIE_SIGNATURE":
				set.status = 401;
				return message("Invalid cookie signature");
			case "PARSE":
				set.status = 400;
				return message("Invalid input");
			default:
				set.status = 500;
				return message("An unknown error occured");
		}
	})
	.use(usersRouter)
	.use(htmlPreview)
	.use(htmxRouter)
	.listen(PORT);
