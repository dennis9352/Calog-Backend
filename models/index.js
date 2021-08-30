import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const connect = () => {
  if (process.env.DEBUG !== "production") {
    mongoose.set("debug", true);
  }
};
const IP = process.env.IPADDRESS;
const dbId = process.env.DBID;
const dbPw = process.env.DBPW;

export const conn = mongoose.createConnection(
  `mongodb://${dbId}:${dbPw}@${IP}:27017/admin`,
  {
    dbName: "calories",
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.error("MongoDB 에러", err);
    else console.log("MongoDB 연결 성공");
  }
);

mongoose.connection.on("error", (err) => {
  console.error("MongoDB 연결 에러", err);
  connect();
});
connect();
