import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const URI = process.env.ATLASURI;
export const conn2 = mongoose.createConnection(
  URI,
  {
    dbName: "atlas",
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
