import colors from "colors/safe";
const LOG_PATH = process.env.LOG_PATH || "api.log";

export async function log(message: string) {
	const logline = `${new Date().toISOString()} ${message}\n`;
	console.log(logline);
	try {
		const logs = await Bun.file(LOG_PATH).text();
		// Write (file's content + request's log)
		await Bun.write(LOG_PATH, logs.concat(logline));
	} catch {
		// If log's file doesn't exist, write new content
		await Bun.write(LOG_PATH, "".concat(logline));
	}
}

export async function logSuccess(message: string) {
	const logline = `🟢 ${new Date().toISOString()} ${message}\n`;
	console.log(colors.green(logline));
	try {
		const logs = await Bun.file(LOG_PATH).text();
		// Write (file's content + request's log)
		await Bun.write(LOG_PATH, logs.concat(logline));
	} catch {
		// If log's file doesn't exist, write new content
		await Bun.write(LOG_PATH, "".concat(logline));
	}
}

export async function logError(message: string) {
	const logline = `🔴 ${new Date().toISOString()} ⚠️ ERROR: ${message}  ⚠️\n`;
	console.error(colors.red(logline));
	try {
		const logs = await Bun.file(LOG_PATH).text();
		// Write (file's content + request's log)
		await Bun.write(LOG_PATH, logs.concat(logline));
	} catch {
		// If log's file doesn't exist, write new content
		await Bun.write(LOG_PATH, "".concat(logline));
	}
}

export async function logWarning(message: string) {
	const logline = `🟠 ${new Date().toISOString()} ⚠️ WARNING: ${message}  ⚠️\n`;
	console.warn(colors.yellow(logline));
	try {
		const logs = await Bun.file(LOG_PATH).text();
		// Write (file's content + request's log)
		await Bun.write(LOG_PATH, logs.concat(logline));
	} catch {
		// If log's file doesn't exist, write new content
		await Bun.write(LOG_PATH, "".concat(logline));
	}
}
