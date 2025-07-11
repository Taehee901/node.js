//먼저 실행됨,테스트
const express = require("express");
require("dotenv").config({ path: "./mysql/.env" });
const { query } = require("./mysql/index.js");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
//cros origin 정책
//const bodyParser = require("body-parser"); //express 내장모듈
//환경변수값

const app = express(); //인스턴스 생성.

//body-parser

//업로드 경로 확인.
let uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  //d://div/git..../05_project/uploads
  fs.mkdirSync(uploadDir);
}

app.use(express.json({ limit: "10mb" })); //크기지정,10kb ->10mb
app.use(cors()); //서버 정보 넣어주면 어떤요청이든지(어느리소스든) 다 허용해줌,CORS 처리.

app.listen(3000, () => {
  //서버실행
  console.log("npm install");
  console.log("http://localhost:3000");
});
app.get("/", (req, res) => {
  //"라우팅"정보들어오면
  res.send("Root Roulter");
});
//path모듈이 있을 경우 -> join 메소드로 함수호출하는 것처럼보이게 사용
app.get("/fileupload", (req, res) => {
  //__dirname현재경로 + 폴더명 + index.html
  res.sendFile(path.join(__dirname, "public", "index.html")); //특정위치의 파일을 열어줄때 사용,app.js기준으로 -> git-node-05위치-./,전체경로를 다 적어도 되는데 경로바뀔때마다 바꿔야 해서 아래와 같이 사용
});

// app.get("/fileupload", (req, res) => {
//   //__dirname현재경로
//   res.sendFile(__dirname + "/public/index.html"); //특정위치의 파일을 열어줄때 사용,app.js기준으로 -> git-node-05위치-./,전체경로를 다 적어도 되는데 경로바뀔때마다 바꿔야 해서 아래와 같이 사용
// });

//다운로드,아이디값 파라미터,그 상품 중 어떤걸 다운할건지(파일이름) => 이미지를 가져옴
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
    //Express(또는 비슷한 서버 프레임워크)에서 응답 본문을 클라이언트에 보낸 뒤 응답을 종료하는 함수라서
    //추가적인 데이터 전송이 불가능해지기 때문에 주석처리해야한다 하지 않을 경우, 그 이후에 이미지 데이터를 보내도 전송되지 않거나 무시됨
    //res.send("다운로드 완료.");
  }
});
//업로드 ,:파라미터
app.post("/upload/:filename/:pid/:type", (req, res) => {
  //객체나 배열에서 원하는 값만 뽑아 변수로 쉽게 만드는  == 디스트럭처링
  const { filename, pid, type } = req.params; // /:product가 있을 경우의 params => {filename:'sample.jpg',product:3},오브젝트 Destructuring

  // express.urlencoded();
  //
  //상품폴더
  let productDir = path.join(uploadDir, pid);
  if (!fs.existsSync(productDir)) {
    //d://div/git..../05_project/uploads
    fs.mkdirSync(productDir);
  }
  //오타 주의 path.vasename = .basename변경
  const safeFilename = path.basename(filename); //경로공격.
  const filePath = path.join(uploadDir, pid, safeFilename); //upload경로에 pid,경로
  //const filePath = `${__dirname}/uploads/${pid}/${filename}`; //d:../05_project/uploads/sample.jpg
  //+8 base64이후의 값을 넣어주기 위해서,slice문자열을 잘라내는거,여기서는 lastIndexOf부분을 잘라냄
  //jsp와 비교시
  try {
    let base64Data = req.body.data;
    let data = req.body.data.slice(base64Data.indexOf(";base64,") + 8);
    // let data = req.body.data.slice(req.body.data.lastIndexOf(";base64,") + 8); // axios에서 넘겨줄때 data로 넘겨줌
    fs.writeFile(filePath, data, "base64", async (err) => {
      //pid,type filename =>db.insert. //req.body.where
      await query("productImageInsert", [
        { product_id: pid, type: type, path: filename },
      ]);
      if (err) {
        res.send("error");
      } else {
        res.send("success");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(400).send("invalid data");
  }
});
//데이터쿼리: api,alias정보넣어주면 페이지 보여줌
//라우팅정보를 통해서 실행할 쿼리지정.:alias => url 호출 =>localhost:3000/api/productList()
app.post("/api/:alias", async (req, res) => {
  //url쿼리들고옴
  // console.log(req.params.alias);
  // console.log(req.body.where);[]
  console.log(req.body.param); //param:
  const result = await query(req.params.alias, req.body.param, req.body.where);
  res.send(result);
});
//mock서버128p 대신 ajox =>128p
//todo목록
app.get("/todoList", async (req, res) => {
  // const result = await query("select * from tbl_todo");
  const result = await query("todoList");
  console.log(result);
  res.json(result);
});
//todo삭제
app.delete("/todo/:id", async (req, res) => {
  const { id } = req.params;
  // const result = await query("todoDelete", req.params.id);
  try {
    const result = await query("todoDelete", id); //아이디속성값가져옴,쿼리,파라미터 전달
    res.json(result);
  } catch (err) {
    res.json(err);
  }
});
// //todo추가
// app.post("/todoList/:name/:chk", async (req, res) => {
//   const result = await query("productInsert");
//   res.json(result);
// });
