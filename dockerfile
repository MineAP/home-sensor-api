FROM node:24-alpine
RUN apk add dumb-init

WORKDIR /usr/src/app
COPY . /usr/src/app/

RUN corepack enable
RUN pnpm install --frozen-lockfile
RUN pnpm build

CMD ["dumb-init", "node", "build/app.js"]
