# Nautilus Core API

## Prerequisites

You will need to have bun installed on your system. Once bun is installed, install dependencies with:

```bash
bun i
```

Next, make sure you have your .env configured correctly:

```toml
NODE_ENV=development
MONGO_URI_DEV=(your MongoDB dev database connection string)
JWT_SECRET=(your JWT Secret)
TBA_KEY=(your Blue Alliance API key)
PORT=1234 # optional
RESEND_KEY=(your Resend API Key) # for transactional email to handle password resets
FROM_ADDR=noreply@example.com # the email address to send transactional email from
HOST=api.example.com # fully qualified domain name of location this api is served from
```

## Development

To start the development server run:

```bash
bun run dev
```

To also enable live updates to TailwindCSS, run

```bash
bun run --watch build
```
