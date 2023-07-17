# Home Sensor API

Node.js + Express + TypeScript + mongoDBで作ったRestAPIサーバー

## 動作環境

- Nodejs: 18.16.1
- Express: 4.18.2
- TypeScript: 5.1.6
- mongoDB: 5.7

## 前提

RaspberryPi4上で、以下のRestAPIサーバーが起動していること。
- https://github.com/MineAP/raspberrypi-camera-server

## Project Init

```sh
npm install
```

## Config

create `.env` , write setting.

```
PORT=3000
RASPI_API_SERVER="http://raspberrypi.local:5000/api"
RASPI_COLLECT_INTERVAL_MS=300000
DB_CONN_STRING="mongodb://<db-user>:<db-pass>@<db-hostname>:27017"
DB_NAME="homesensordb"
```

## How to run (debug)

```sh
npx ts-node app.ts
```

## build & run

```sh
npx tsc
node app.js
```
