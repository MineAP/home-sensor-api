FROM node:lts-alpine
RUN apk add dumb-init

WORKDIR /usr/src/app
COPY . /usr/src/app/

RUN npm isntall
RUN npx tsc

CMD ["dumb-init", "node", "app.js"]