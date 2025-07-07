//먼저 실행됨
const express = require("express");
require("dotenv").config({ path: "./mysql/.env" });
const { query } = require("./mysql/index.js");
const fs = require("fs");
//const bodyParser = require("body-parser"); //express 내장모듈
//환경변수값

const app = express();
//body-parser
app.use(express.json());

app.listen(3000, () => {
  console.log("npm install");
  console.log("http://localhost:3000");
});
app.get("/", (req, res) => {
  res.send("Root Roulter");
});

//다운로드,아이디값 파라미터,그 상품 중 어떤걸 다운할건지(파일이름)
app.get("/download/:productId/:fileName", (req, res) => {
  const { productId, fileName } = req.params; //파라미터를 각각 파일에 담겠다는 의미.
  const filepath = `${__dirname}/uploads/${productId}/${fileName}`; //d:div:git:node:05_project,파일가져올경로
  //응답정보substring
  // res.header("Content-Type", `image/${fileName.lastIndexOF(".")}`);
  res.header(
    "Content-Type",
    `image/${fileName.substring(fileName.lastIndexOf("."))}`
  );

  //경로에 실제파일있는지 확인
  if (!fs.existsSync(filepath)) {
    res.send("파일이 없습니다."); //경로파일에 안맞게 입력하면
  } else {
    fs.createReadStream(filepath).pipe(res); //파일을응답정보에복사하고는 끝,pipe복사
    res.send("다운로드 완료.");
  }
});
//업로드

//데이터쿼리

//라우팅정보를 통해서 실행할 쿼리지정.:alias => url 호출 =>localhost:3000/api/productList()
app.post("/api/:alias", async (req, res) => {
  // console.log(req.params.alias);
  // console.log(req.body.where);[]
  console.log(req.body.param); //param:
  const result = await query(req.params.alias, req.body.param, req.body.where);
  res.send(result);
});
