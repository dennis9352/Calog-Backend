import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.ATLASURI; //dot env를 이용하여 URI(mongo DB atlas에서 받아온 SRV) 값을 감춤.
export const conn2 = mongoose.createConnection( //createConnection에서 URI를 받고 변수 conn2에 할당함.
  URI,
  {
    dbName: "atlas",//atlas DB와 연결
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  },
  (err) => {
    if (err) console.error("MongoDB 에러", err);
    else console.log("ATLAS DB 연결 성공");
  }
);

mongoose.connection.on("error", (err) => {
  console.error("ATLAS DB 연결 에러", err);
  connect();
});
