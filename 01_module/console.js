//01_module/console.js
const { Console } = require("console"); //Console이라는클래스객체들고옴
const fs = require("fs"); //filesystem,이미가지고있는내장객체 모듈

const output = fs.createWriteStream("./sample/output.log"); //파일하나생성하는,자바 outstream
const errlog = fs.createWriteStream("./sample/errlog.log");

const logger = new Console({
  stdout: output,
  stderr: errlog,
});

console.log("end");
