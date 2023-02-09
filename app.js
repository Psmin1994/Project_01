"use strict";

// 모듈
import express from "express";
import path from "path";
import dotenv from "dotenv";
const bodyParser = require("body-parser");
dotenv.config();
// 협업 시 개발자 별 운영체제가 다를 때 dotenv모듈로 동일하게 사용가능

const app = express();

// 라우팅

// 미들웨어
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
// URL을 통해 전달되는 데이터에 한글, 공백 등의 문자 인식 오류 문제 방지,해결
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(morgan("tiny", { stream: logger.stream }));

const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`server running in ${port}`);
});
