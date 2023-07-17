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
exports.DataCollectService = void 0;
const http = __importStar(require("http"));
const MongoService_1 = require("./MongoService");
//import * as https from "https";
const url = process.env.RASPI_API_SERVER;
const url_temperatureandhumidity = url + "/temperatureandhumidity";
const url_cpu = url + "/cpu/";
const url_camera = url + "/camera/";
const request = (options) => {
    return new Promise((resolve, reject) => {
        http
            .request(options, (res) => {
            const data = [];
            res.on("data", (d) => data.push(String(d)));
            res.on("end", () => resolve(data.join("")));
        })
            .on("error", reject)
            .end();
    });
};
//クラス
class DataCollectService {
    startTimer(interval_ms) {
        this.collectData();
        setInterval(() => {
            this.collectData();
        }, interval_ms);
    }
    collectData(retoryCount = 0) {
        return __awaiter(this, void 0, void 0, function* () {
            // とりあえず全部同じ取得間隔
            yield this.collectTempAndHumid(retoryCount);
            yield this.collectCpuInfo();
            yield this.collectCaptureImage();
        });
    }
    collectTempAndHumid(retoryCount = 0) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ret = yield request(url_temperatureandhumidity);
                const json = JSON.parse(ret);
                // json format
                /*
                    {
                        "timestamp": 1689315011.152732,
                        "data": {
                            "room_temperature": 25.9,
                            "room_humidity": 55.2
                        }
                    }
                 */
                if (json["data"]["room_temperature"] == "N/A" || json["data"]["room_humidity"] == "N/A") {
                    console.log("can't collect data (value is N/A)");
                    if (retoryCount < 5) {
                        console.log("retory collectTempAndHumid() ...");
                        this.collectData(retoryCount++);
                    }
                }
                else {
                    const log = {
                        timestamp: new Date(json["timestamp"] * 1000),
                        temperature: Number(json["data"]["room_temperature"]),
                        humidity: Number(json["data"]["room_humidity"])
                    };
                    const insert = yield ((_a = MongoService_1.collections.raspiSensorLogs) === null || _a === void 0 ? void 0 : _a.insertOne(log));
                    console.log("collectTempAndHumid() result:" + JSON.stringify(log));
                }
            }
            catch (err) {
                console.error("collectTempAndHumid() error: " + err);
            }
        });
    }
    collectCpuInfo() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ret = yield request(url_cpu);
                const json = JSON.parse(ret);
                const cpuInfo = {
                    timestamp: new Date(json["timestamp"] * 1000),
                    clock: Number(json["data"]["cpu_clock"]),
                    temp: Number(json["data"]["cpu_temp"])
                };
                const insert = yield ((_a = MongoService_1.collections.raspiCpuInfo) === null || _a === void 0 ? void 0 : _a.insertOne(cpuInfo));
                console.log("collectCpuInfo() result:" + JSON.stringify(cpuInfo));
            }
            catch (err) {
                console.error("collectCpuInfo() error: " + err);
            }
        });
    }
    collectCaptureImage() {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ret = yield request(url_camera);
                const json = JSON.parse(ret);
                const cameraInfo = {
                    timestamp: new Date(json["timestamp"] * 1000),
                    image: json["data"]
                };
                const insert = yield ((_a = MongoService_1.collections.raspiCameraData) === null || _a === void 0 ? void 0 : _a.insertOne(cameraInfo));
                console.log("collectCaptureImage() result:" + JSON.stringify({
                    _id: insert === null || insert === void 0 ? void 0 : insert.insertedId,
                    imageLength: cameraInfo.image.length
                }));
            }
            catch (err) {
                console.error("collectCaptureImage() error: " + err);
            }
        });
    }
}
exports.DataCollectService = DataCollectService;
