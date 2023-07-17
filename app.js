"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// ライブラリ読み込み
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
const MongoService_1 = require("./services/MongoService");
const DataCollectService_1 = require("./services/DataCollectService");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
const bodyParser = require('body-parser');
//body-parserの設定
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// mongodb
(0, MongoService_1.connectToDatabase)();
// データ収集処理
const interval_ms = process.env.RASPI_COLLECT_INTERVAL_MS || "1000";
const service = new DataCollectService_1.DataCollectService();
service.startTimer(Number.parseInt(interval_ms));
//静的リソース
app.use(express_1.default.static('public'));
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
