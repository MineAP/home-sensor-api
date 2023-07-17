import * as mongoDB from "mongodb";
import { IRaspiCameraData, IRaspiCpuInfo, IRaspiSensorLog } from "../models/TestMongoModel"
import { promises } from "dns";
import { DataCollectService } from "./DataCollectService";

export const collections: { 
    raspiSensorLogs?: mongoDB.Collection<IRaspiSensorLog>,
    raspiCpuInfo?: mongoDB.Collection<IRaspiCpuInfo>,
    raspiCameraData?: mongoDB.Collection<IRaspiCameraData>,
} = {}

export async function connectToDatabase() {
    
    const url = process.env.DB_CONN_STRING
    if (!url) {
        throw new Error(`invalid DB_CONN_STRING=${url}`)
    }

    const client: mongoDB.MongoClient = new mongoDB.MongoClient(url);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const sensorLogsCollection: mongoDB.Collection<IRaspiSensorLog> = db.collection<IRaspiSensorLog>("raspi_sensor_logs")
    const cpuInfoCollection: mongoDB.Collection<IRaspiCpuInfo> = db.collection<IRaspiCpuInfo>("raspi_cpu_info")
    const cameraDataCollection: mongoDB.Collection<IRaspiCameraData> = db.collection<IRaspiCameraData>("raspi_camera_data")
 
    collections.raspiSensorLogs = sensorLogsCollection
    collections.raspiSensorLogs.createIndex( { "timestamp": 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 } )
    collections.raspiCpuInfo = cpuInfoCollection
    collections.raspiCpuInfo.createIndex( { "timestamp": 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 } )
    collections.raspiCameraData = cameraDataCollection
    collections.raspiCameraData.createIndex( { "timestamp": 1 }, { expireAfterSeconds: 60 * 60 * 24 * 7 } )
       
    console.log(`Successfully connected to database: ${db.databaseName} `);
}


//クラス
export class RaspiSensorLogsMongoService {
    public async select(start:Date, end:Date): Promise<IRaspiSensorLog[]> {
        const select = (await collections.raspiSensorLogs?.find({
            $gte: start,
            $lte: end,
        }).toArray()) as IRaspiSensorLog[];
        return select;
    }
    public async all(maxCount:number=100): Promise<IRaspiSensorLog[]> {
        const dataAll = (await collections.raspiSensorLogs?.find({}).sort({"timestamp": -1}).limit(maxCount).toArray()) as IRaspiSensorLog[];
        return dataAll;
    }
}

export class RaspiCpuInfoMongoService {
    public async select(start:Date, end:Date): Promise<IRaspiCpuInfo[]> {
        const select = (await collections.raspiCpuInfo?.find({
            $gte: start,
            $lte: end,
        }).toArray()) as IRaspiCpuInfo[];
        return select;
    }
    public async last(): Promise<IRaspiCpuInfo | undefined> {
        const last = (await collections.raspiCpuInfo?.find({}).sort({"timestamp": -1}).limit(1).toArray()) as IRaspiCpuInfo[];
        if (last.length == 1) {
            return last[0]
        }
        return undefined;
    }
    public async now(): Promise<IRaspiCpuInfo | undefined> {
        const service = new DataCollectService()
        await service.collectCpuInfo()
        return await this.last()
    }
    public async all(maxCount:number=100): Promise<IRaspiCpuInfo[]> {
        const dataAll = (await collections.raspiCpuInfo?.find({}).sort({"timestamp": -1}).limit(maxCount).toArray()) as IRaspiCpuInfo[];
        return dataAll;
    }
}

export class RaspiCameraDataMongoService {
    public async select(start:Date, end:Date): Promise<IRaspiCameraData[]> {
        const select = (await collections.raspiCameraData?.find({
            $gte: start,
            $lte: end,
        }).toArray()) as IRaspiCameraData[];
        return select;
    }
    public async last(): Promise<IRaspiCameraData | undefined> {
        const last = (await collections.raspiCameraData?.find({}).sort({"timestamp": -1}).limit(1).toArray()) as IRaspiCameraData[];
        if (last.length == 1) {
            return last[0]
        }
        return undefined;
    }
    public async now(): Promise<IRaspiCameraData | undefined> {
        const service = new DataCollectService()
        await service.collectCaptureImage()
        return await this.last()
    }
    public async all(maxCount:number=100): Promise<IRaspiCameraData[]> {
        const dataAll = (await collections.raspiCameraData?.find({}).sort({"timestamp": -1}).limit(maxCount).toArray()) as IRaspiCameraData[];
        return dataAll;
    }
}
