import sanitize from "sanitize-html";
import { Render } from "../components/render";

export default function HtmxBase({
	title,
	children,
}: {
	title: string;
	children: JSX.Element;
}) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1"
				/>
				<title safe>{title}</title>
				<script src="/htmx.min.js"></script>
				<link rel="stylesheet" href="/index.css" />
				<link
					rel="stylesheet"
					href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0"
				/>
			</head>
			{children}
		</html>
	);
}
