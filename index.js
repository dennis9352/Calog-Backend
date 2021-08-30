import express from "express";
import cors from "cors";
import router from "./routes/index.js";
import dotenv from "dotenv";
import "./models/index.js";
import passport from "passport";
import session from "express-session";
import { csrfCheck } from "./middlewares/csrf.js";
import * as Sentry from "@sentry/node";

dotenv.config();
const app = express();

const corsOption = {
  origin: process.env.CORS,
  Credential: true,
  optionSuccessStatus: 200,
};
//sentry
if (process.env.SENTRY === "production") {
  Sentry.init({ dsn: process.env.SENTRY_DSN });
}

//passportsetting
app.use(
  session({
    secret: "MySecret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use(cors(corsOption));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(csrfCheck);
app.use("/api", router);

app.use(Sentry.Handlers.errorHandler({}));

app.listen(process.env.PORT || 3000, () => {
  console.log("서버 연결 성공");
});
