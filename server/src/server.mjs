import express from "express";
import "dotenv/config";
import router from "./routes/index.mjs";
import passport from "passport";
import googleStrategy from "./strategies/googleStrategy.mjs";
import jwtStrategy from "./strategies/jwtStrategy.mjs";
import cookieParser from "cookie-parser";
passport.use(googleStrategy);
passport.use(jwtStrategy);

const app = express();
//using this middleware allow express to parase the incoming request with json req.body
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use("/api", router);

app.listen(process.env.PORT || 3000);
