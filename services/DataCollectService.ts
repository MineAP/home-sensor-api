import * as http from "http";
import { collections } from "./MongoService";
import { IRaspiCameraData, IRaspiCpuInfo, IRaspiSensorLog } from "../models/TestMongoModel";
//import * as https from "https";

const url = process.env.RASPI_API_SERVER
const url_temperatureandhumidity = url + "/temperatureandhumidity"
const url_cpu = url + "/cpu/"
const url_camera = url + "/camera/"

const request = (options: string | URL | http.RequestOptions) => {
    return new Promise<string>((resolve, reject) => {
        http
        .request(options, (res) => {
            const data:String[] = [];
            res.on("data", (d) => data.push(String(d)));
            res.on("end", () => resolve(data.join("")));
        })
        .on("error", reject)
        .end();
    });
};

//クラス
export class DataCollectService {

    public startTimer(interval_ms:number) {
        console.log(`DataCollectService.startTimer() interval=${interval_ms}`)
        this.collectData()
        setInterval(() => {
            this.collectData()
        }, interval_ms)
    }

    public async collectData(retoryCount=0) {
        // とりあえず全部同じ取得間隔
        await this.collectTempAndHumid(retoryCount)
        await this.collectCpuInfo()
        await this.collectCaptureImage()
    }

    public async collectTempAndHumid(retoryCount=0) {
        try {

            const ret = await request(url_temperatureandhumidity)
            const json = JSON.parse(ret)

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

            if(json["data"]["room_temperature"] == "N/A" || json["data"]["room_humidity"] == "N/A") {
                console.log("can't collect data (value is N/A)");
                
                if (retoryCount < 5) {
                    retoryCount = retoryCount + 1
                    console.log(`re-try ${retoryCount} collectTempAndHumid() ...`)
                    this.collectData(retoryCount)
                } else {
                    console.log(`re-try out.`)
                }
            } else {
                const log: IRaspiSensorLog = {
                    timestamp: new Date(json["timestamp"] * 1000),
                    temperature: Number(json["data"]["room_temperature"]),
                    humidity: Number(json["data"]["room_humidity"])
                }

                const insert = await collections.raspiSensorLogs?.insertOne(log)
                console.log("collectTempAndHumid() result:" + JSON.stringify(log))
            }

        } catch (err) {
            console.error("collectTempAndHumid() error: " + err);
        }
    }

    public async collectCpuInfo() {
        try {

            const ret = await request(url_cpu)
            const json = JSON.parse(ret)
            
            const cpuInfo: IRaspiCpuInfo = {
                timestamp: new Date(json["timestamp"] * 1000),
                clock: Number(json["data"]["cpu_clock"]),
                temp: Number(json["data"]["cpu_temp"])
            }
            const insert = await collections.raspiCpuInfo?.insertOne(cpuInfo);
            console.log("collectCpuInfo() result:" + JSON.stringify(cpuInfo))

        } catch (err) {
            console.error("collectCpuInfo() error: " + err);
        }
    }

    public async collectCaptureImage() {

        try {
            const ret = await request(url_camera)
            const json = JSON.parse(ret)

            const cameraInfo: IRaspiCameraData = {
                timestamp: new Date(json["timestamp"] * 1000),
                image: json["data"]
            }
            const insert = await collections.raspiCameraData?.insertOne(cameraInfo);
            console.log("collectCaptureImage() result:" + JSON.stringify({
                timestammp: cameraInfo.timestamp,
                imageLength: cameraInfo.image.length,
                _id: insert?.insertedId,
            }))

        } catch (err) {
            console.error("collectCaptureImage() error: " + err);
        }

    }

}

