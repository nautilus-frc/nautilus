export function randInt(min: number, max: number) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randStr(len: number) {
	const validChars =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
	let res = "";
	for (let i = 0; i < len; i++) {
		res += validChars[randInt(0, validChars.length - 1)];
	}
	return res;
}
