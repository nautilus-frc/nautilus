export function PasswordResetEmail({
	otp,
	host,
}: {
	otp: string;
	host: string;
}) {
	return (
		<html lang="en">
			<head>
				<meta charset="UTF-8" />
				<meta
					name="viewport"
					content="width=device-width, initial-scale=1.0"
				/>
			</head>
			<body style="padding:1rem;background-color:black;">
				<div style="background-color:rgb(23,23,33);color:#EBF7ED;padding:2rem;display:grid;border-radius:16px;font-family:sans-serif">
					<h1>Your Password Reset Code</h1>
					<h2>Below is the one-time code to reset your password</h2>
					<p>
						Copy and paste the code into the prompt on the link
						below
					</p>
					<h2
						safe
						style="display:block;padding:32px;background-color:black;color:white;width:fit-content;border-radius:4px;letter-spacing:.8rem;font-family:monospace"
					>
						{otp.toUpperCase()}
					</h2>
					<br></br>
					<a
						href={"http://" + host + "/reset-password"}
						style="font-weight:bold;font-size:2rem;color:darkgrey"
					>
						Click here to reset your password
					</a>
					<br></br>
					<strong>THIS CODE WILL EXPIRE IN 72 HOURS</strong>
				</div>
			</body>
		</html>
	);
}
