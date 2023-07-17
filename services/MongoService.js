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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RaspiCameraDataMongoService = exports.RaspiCpuInfoMongoService = exports.RaspiSensorLogsMongoService = exports.connectToDatabase = exports.collections = void 0;
const mongoDB = __importStar(require("mongodb"));
const DataCollectService_1 = require("./DataCollectService");
exports.collections = {};
function connectToDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
        const url = process.env.DB_CONN_STRING;
        if (!url) {
            throw new Error(`invalid DB_CONN_STRING=${url}`);
        }
        const client = new mongoDB.MongoClient(url);
        yield client.connect();
        const db = client.db(process.env.DB_NAME);
        const sensorLogsCollection = db.collection("raspi_sensor_logs");
        const cpuInfoCollection = db.collection("raspi_cpu_info");
        const cameraDataCollection = db.collection("raspi_camera_data");
        exports.collections.raspiSensorLogs = sensorLogsCollection;
        exports.collections.raspiSensorLogs.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
        exports.collections.raspiCpuInfo = cpuInfoCollection;
        exports.collections.raspiCpuInfo.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
        exports.collections.raspiCameraData = cameraDataCollection;
        exports.collections.raspiCameraData.createIndex({ "timestamp": 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 });
        console.log(`Successfully connected to database: ${db.databaseName} `);
    });
}
exports.connectToDatabase = connectToDatabase;
//クラス
class RaspiSensorLogsMongoService {
    select(start, end) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const select = (yield ((_a = exports.collections.raspiSensorLogs) === null || _a === void 0 ? void 0 : _a.find({
                $gte: start,
                $lte: end,
            }).toArray()));
            return select;
        });
    }
    all(maxCount = 100) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dataAll = (yield ((_a = exports.collections.raspiSensorLogs) === null || _a === void 0 ? void 0 : _a.find({}).sort({ "timestamp": -1 }).limit(maxCount).toArray()));
            return dataAll;
        });
    }
}
exports.RaspiSensorLogsMongoService = RaspiSensorLogsMongoService;
class RaspiCpuInfoMongoService {
    select(start, end) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const select = (yield ((_a = exports.collections.raspiCpuInfo) === null || _a === void 0 ? void 0 : _a.find({
                $gte: start,
                $lte: end,
            }).toArray()));
            return select;
        });
    }
    last() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const last = (yield ((_a = exports.collections.raspiCpuInfo) === null || _a === void 0 ? void 0 : _a.find({}).sort({ "timestamp": -1 }).limit(1).toArray()));
            if (last.length == 1) {
                return last[0];
            }
            return undefined;
        });
    }
    now() {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new DataCollectService_1.DataCollectService();
            yield service.collectCpuInfo();
            return yield this.last();
        });
    }
    all(maxCount = 100) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dataAll = (yield ((_a = exports.collections.raspiCpuInfo) === null || _a === void 0 ? void 0 : _a.find({}).sort({ "timestamp": -1 }).limit(maxCount).toArray()));
            return dataAll;
        });
    }
}
exports.RaspiCpuInfoMongoService = RaspiCpuInfoMongoService;
class RaspiCameraDataMongoService {
    select(start, end) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const select = (yield ((_a = exports.collections.raspiCameraData) === null || _a === void 0 ? void 0 : _a.find({
                $gte: start,
                $lte: end,
            }).toArray()));
            return select;
        });
    }
    last() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const last = (yield ((_a = exports.collections.raspiCameraData) === null || _a === void 0 ? void 0 : _a.find({}).sort({ "timestamp": -1 }).limit(1).toArray()));
            if (last.length == 1) {
                return last[0];
            }
            return undefined;
        });
    }
    now() {
        return __awaiter(this, void 0, void 0, function* () {
            const service = new DataCollectService_1.DataCollectService();
            yield service.collectCaptureImage();
            return yield this.last();
        });
    }
    all(maxCount = 100) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const dataAll = (yield ((_a = exports.collections.raspiCameraData) === null || _a === void 0 ? void 0 : _a.find({}).sort({ "timestamp": -1 }).limit(maxCount).toArray()));
            return dataAll;
        });
    }
}
exports.RaspiCameraDataMongoService = RaspiCameraDataMongoService;
