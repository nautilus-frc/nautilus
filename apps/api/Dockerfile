# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 as base
WORKDIR /usr/src/app

FROM base
COPY . .
RUN bun install

# tests & build
ENV NODE_ENV=production
RUN bun run test
RUN bun run build

# run the app
USER root
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
