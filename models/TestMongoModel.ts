
//インターフェース
export interface IRaspiSensorLog {
    timestamp: Date,
    temperature: number,
    humidity: number
}

export interface IRaspiCpuInfo {
    timestamp: Date,
    clock: number,
    temp: number
}

export interface IRaspiCameraData {
    timestamp: Date,
    image: String 
}

// const TestMongoSchema = new Schema({
//     user :String,
//     email: String
// },{
//     collection: 'test_user'
// });

// // スキーマをモデルとしてコンパイルし、それをモジュールとして扱えるようにする
// module.exports = mongoose.model('TestMongoModel', TestMongoSchema);