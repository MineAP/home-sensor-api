"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const MongoService_1 = require("../services/MongoService");
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// ルーティングする
const router = express_1.default.Router();
// routerにルーティングの動作を記述する
router.get('/helloWorld', (req, res) => {
    res.status(200).send({ message: 'Hello, world' });
});
router.get('/sensorlogs/', (req, res, next) => {
    const count = Number(req.query.count) || 100;
    const service = new MongoService_1.RaspiSensorLogsMongoService();
    service
        .all(count)
        .then(result => res.status(200).send(result))
        .catch(next);
});
router.get('/sensorlogs/last', (req, res, next) => {
    const service = new MongoService_1.RaspiSensorLogsMongoService();
    service
        .all(1)
        .then(result => {
        if (result.length > 0) {
            res.status(200).send(result[0]);
        }
        else {
            res.status(404).end();
        }
    })
        .catch(next);
});
router.get('/raspicpuinfo/', (req, res, next) => {
    const service = new MongoService_1.RaspiCpuInfoMongoService();
    service
        .now()
        .then(result => res.status(200).send(result))
        .catch(next);
});
router.get('/raspicameradata/', (req, res, next) => {
    const service = new MongoService_1.RaspiCameraDataMongoService();
    service
        .now()
        .then(result => res.status(200).send(result))
        .catch(next);
});
router.get('/raspicameradata/img', (req, res, next) => {
    const service = new MongoService_1.RaspiCameraDataMongoService();
    service
        .last()
        .then(result => {
        const base64Str = result === null || result === void 0 ? void 0 : result.image;
        if (!base64Str) {
            res.status(400).end();
        }
        else {
            var bitmap = Buffer.from(base64Str, 'base64');
            res.status(200).contentType('').send(bitmap);
        }
    })
        .catch(next);
});
// -------------------------------------------------
//  以下、何のルーティングにもマッチしないorエラー
// -------------------------------------------------
// いずれのルーティングにもマッチしない(==NOT FOUND)
app.use((req, res) => {
    res.status(404);
    res.render('error', {
        param: {
            status: 404,
            message: 'not found'
        },
    });
});
//routerをモジュールとして扱う準備
module.exports = router;
