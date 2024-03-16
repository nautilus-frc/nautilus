import colors from "colors/safe";
import { HeapSnapshot, generateHeapSnapshot } from "bun";
import { heapStats } from "bun:jsc";

const LOG_PATH = process.env.LOG_PATH || "api.log";
const LOG_ERROR_PATH = `error.${LOG_PATH}`;
const HEAP_STATS_LOG = LOG_PATH + ".heap.json";
const HEAP_SNAPSHOT_LOG = LOG_PATH + ".heap.snapshot.json";

export async function logMemory() {
	const heapSnapshot = generateHeapSnapshot();
	const stats = heapStats();
	await writeToHeapLogs(stats);
	await writeToSnapshotLogs(heapSnapshot);
}

async function writeToHeapLogs(stats: ReturnType<typeof heapStats>) {
	const newEntry = {
		time: Date.now(),
		heap: stats,
	};
	try {
		const text = await Bun.file(HEAP_STATS_LOG).text();
		const json: unknown = JSON.parse(text);
		if (Array.isArray(json)) {
			const updated = [...json, newEntry];
			await Bun.write(HEAP_STATS_LOG, JSON.stringify(updated, null, 2));
		} else {
			throw "meow";
		}
	} catch {
		await Bun.write(HEAP_STATS_LOG, JSON.stringify([newEntry], null, 2));
	}
}

async function writeToSnapshotLogs(snapshot: HeapSnapshot) {
	const newEntry = {
		time: Date.now(),
		snapshot: snapshot,
	};
	try {
		const text = await Bun.file(HEAP_SNAPSHOT_LOG).text();
		const json: unknown = JSON.parse(text);
		if (Array.isArray(json)) {
			const updated = [...json, newEntry];
			await Bun.write(
				HEAP_SNAPSHOT_LOG,
				JSON.stringify(updated, null, 2)
			);
		} else {
			throw "meow";
		}
	} catch {
		await Bun.write(HEAP_SNAPSHOT_LOG, JSON.stringify([newEntry], null, 2));
	}
}

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
	try {
		const logs = await Bun.file(LOG_ERROR_PATH).text();
		// Write (file's content + request's log)
		await Bun.write(LOG_ERROR_PATH, logs.concat(logline));
	} catch {
		// If log's file doesn't exist, write new content
		await Bun.write(LOG_ERROR_PATH, "".concat(logline));
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
