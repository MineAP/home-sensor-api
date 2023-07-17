import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { RaspiCameraDataMongoService, RaspiCpuInfoMongoService, RaspiSensorLogsMongoService } from '../services/MongoService';
import moment from 'moment';
const app = express();
app.use(helmet());
app.use(cors());
// ルーティングする
const router = express.Router();

// routerにルーティングの動作を記述する
router.get('/helloWorld', (req, res) => {
    res.status(200).send({ message: 'Hello, world' });
});

router.get('/sensorlogs/', (req, res, next) => {
  const count = Number(req.query.count) || 100
  const service = new RaspiSensorLogsMongoService();

  service
    .all(count)
    .then(result => res.status(200).send(result))
    .catch(next);

});

router.get('/sensorlogs/last', (req, res, next) => {
  const service = new RaspiSensorLogsMongoService();

  service
    .all(1)
    .then(result => {
      if (result.length > 0) {
        res.status(200).send(result[0])
      } else {
        res.status(404).end()
      }
    })
    .catch(next);

});

router.get('/raspicpuinfo/', (req, res, next) => {
  const service = new RaspiCpuInfoMongoService();

  service
    .now()
    .then(result => res.status(200).send(result))
    .catch(next);

});

router.get('/raspicameradata/', (req, res, next) => {
  const service = new RaspiCameraDataMongoService();

  service
    .now()
    .then(result => res.status(200).send(result))
    .catch(next);

});

router.get('/raspicameradata/img', (req, res, next) => {
  const service = new RaspiCameraDataMongoService();

  service
    .last()
    .then(result => {

      const base64Str = result?.image
      if (!base64Str) {
        res.status(400).end()
      } else {
        var bitmap = Buffer.from(base64Str, 'base64');
        res.status(200).contentType('').send(bitmap)
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