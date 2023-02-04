"use strict";

// 모듈
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config();
// 협업 시 개발자 별 운영체제가 다를 때 dotenv모듈로 동일하게 사용가능

const app = express();

// 라우팅
const home = require("./src/routes/home");

// 미들웨어
app.use(express.static(`${__dirname}/src/public`));
app.use(bodyParser.json());
// URL을 통해 전달되는 데이터에 한글, 공백 등의 문자 인식 오류 문제 방지,해결
app.use(bodyParser.urlencoded({ extended: true }));

// app.use(morgan("tiny", { stream: logger.stream }));

app.use("/", home);

module.exports = app;
