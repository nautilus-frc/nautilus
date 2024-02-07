import { $, file } from "bun";
import { readdir } from "fs/promises";
//run a script on all apps

const SCRIPT = process.argv[2];

const apps = await readdir("apps");

for (const app of apps) {
	if (app != ".DS_Store") {
		// await $`bun run ${SCRIPT}`.cwd(`apps/${app}`);
		try {
			const pjson = await file(`apps/${app}/package.json`).text();
			const packageJson = JSON.parse(pjson);
			const scripts = packageJson.scripts;
			if (scripts && SCRIPT && SCRIPT in scripts) {
				await $`bun run ${SCRIPT}`.cwd(`apps/${app}`);
			}
		} catch (e) {
			console.warn(`Error running ${SCRIPT} in ${app}: ${e}`);
		}
	}
}
