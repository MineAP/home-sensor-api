// ライブラリ読み込み
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import * as dotenv from "dotenv";
dotenv.config()
import { connectToDatabase } from './services/MongoService'
import { DataCollectService } from './services/DataCollectService'
const app = express();
app.use(helmet());
app.use(cors());
const bodyParser = require('body-parser');

//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// mongodb
connectToDatabase()

// データ収集処理
const interval_ms = process.env.RASPI_COLLECT_INTERVAL_MS || "1000";
const service = new DataCollectService();
service.startTimer(Number.parseInt(interval_ms))

//静的リソース
app.use(express.static('public'));

//ルーティング
const router = require('./routes/');
app.use('/', router);

app.get('/helloWorld', (req, res) => {
    res.status(200).send({ message: 'hello, world' });
});

//サーバ起動
const port = process.env.PORT || 3000; // port番号を指定
app.listen(port);
console.log('listen on port ' + port);


