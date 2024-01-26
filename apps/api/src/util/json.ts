export default function json(
	obj: Record<string, unknown> | Array<unknown>
): string {
	return JSON.stringify(obj);
}

export function message(message: string): string {
	return json({ message });
}
