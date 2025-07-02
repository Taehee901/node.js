//01_module/console.js
//내장모듈
const { Console } = require("console"); //Console이라는클래스객체들고옴,node가 가지고있는 기본 module
const fs = require("fs"); //filesystem,이미가지고있는내장객체 모듈
//외부모듈은 설치해야함 npm,모듈관리 패키지,npm install express.
const express = require("express"); //외부모듈

//sample폴더 하위에output.log파일생성
const output = fs.createWriteStream("./sample/output.log", { flags: "a" }); //파일하나생성하는,자바 outstream,a=append 누적됨 값이
//sample폴더 하위에errlog.log파일생성
const errlog = fs.createWriteStream("./sample/errlog.log", { flags: "a" });

const logger = new Console({
  stdout: output, //logger.log기록됨
  stderr: errlog, //에러형태의 매소드 logger.error
});
logger.log("로그기록하기.");
logger.error("에러로그기록하기");
console.log("end");
