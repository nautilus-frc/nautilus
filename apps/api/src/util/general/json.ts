export default function json(
	obj: Record<string, unknown> | Array<unknown>
): string {
	return JSON.stringify(obj);
}

export function message(message: string): MessageT {
	return { message };
}

export type MessageT = {
	message: string;
};

export function isJson(str: unknown) {
	try {
		JSON.parse(str as string);
	} catch (e) {
		return false;
	}
	return true;
}
