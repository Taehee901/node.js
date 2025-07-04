//app.js,mysql안되는 이유->
// const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path"); //내장객체라 설치x
const multer = require("multer");
const xlsx = require("xlsx"); //엑셀시트 분리하는 기능이 있음.
require("dotenv").config({ path: "./sql/.env" }); //env 파일 경로를 path지정
require("dotenv").config({ path: "./nodemailer/.env" });
const nodemailer = require("./nodemailer"); //index.js 안적어도 알아서  import해줌

//환경변수읽어올때
// console.log(process.env.HOST);
// console.log(process.env.USER);
const mysql = require("./sql"); //index.js는생략가능해서 폴더이름만 작성해줘도 된다. ./sql/index
const { findSourceMap } = require("module");

// const custSql = require("./sql/customerSql"); //반환 객체,{customerList,customerIn~},상수에담긴값이 쿼리 객체 값이 반환
//pool 데이터베이스를 사용반환반복{db정보넣어주면됨}
// const pool = mysql.createPool({
//   host: "127.0.0.1",
//   port: 3306,
//   user: "dev01",
//   password: "dev01",
//   database: "dev",
//   connectionLimit: 10,
// });

const app = express();
app.use(bodyParser.json()); //json 의 형태의 값을 body영역에 사용,urlencoding 방식도넣어주면 됨
//라우터 정보
app.get("/", (req, res) => {
  res.send("Root 경로");
});
//이메일 발송 화면.
//이메일주소,get방식이면 페이지 열어주는거
app.get("/email", (req, res) => {
  //sendFile절대경로기준으로
  res.sendFile(path.join(__dirname, "public", "index.html")); //path경로편하게 지정.__현재기준기준,여러경로합쳐서 경로보여주고 싶을 때 join
});

//에러발생,new
// app.get("/test", (rep, res) => {
//   // console.log("test");
//   res.send("test");
// });

//실제 이메일 전송.
app.post("/email", async (rep, res) => {
  try {
    let result = await nodemailer.sendEmail(rep.body.param); //반환결과값을 sendEmail호출하는데서 값을 던짐
    console.log(result); //undefined 리턴해주는 값이 없어서..,promise 써서 함수에 값전달해줘서?
    //res.send("메일발송성공");
    res.json({ retCode: "success", retVal: result }); //{"retCode":"success"}
  } catch (err) {
    //res.send("메일발송성공");
    res.json({ retCode: "fail" });
  }
});
//엑셀 업로드 -> DB insert.
//multer
// //Multer 인스턴스 생성.
// const upload = multer({
//   storage: storage, //저장공간
//   limits: { fileSize: 5 * 1024 * 1024 },
// });

// app.get("/excel", (req, res) => {
//   //sendFile절대경로기준으로
//   res.sendFile(path.join(__dirname, "public", "excel.html"));
// });

// //첨부처리.
// app.get("/excel", upload.single("myFile"), (req, res) => {
//   console.log(req.file); //업로드된 파일의 정보
//   console.log(req.body); //요청몸체의 정보.
//   const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
//   const firstSheetName = workbook.SheetNames[0]; //첫번째 시트.
//   if (!req.file) {
//     res.send("파일 처리가능함.");
//   } else {
//     res.send("업로드 완료.");
//   }
// });
// //저장경로와 파일명 지정.
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     //저장경로.
//     cb(null, "uploads");
//   },

//   filename: function (req, file, cb) {
//     //업로드 파일명
//     let fn = Buffer.from(file.originalname, "latin1").toString("utf-8");
//     cb(null, Date.now() + "_" + fn); //
//   },
// });
// ① storage 먼저 선언
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    let fn = Buffer.from(file.originalname, "latin1").toString("utf-8");
    cb(null, Date.now() + "_" + fn);
  },
});

// ② 그 다음 upload 선언
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// ③ 이후 라우터들
app.get("/excel", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "excel.html"));
});

app.post("/excel", upload.single("myFile"), (req, res) => {
  console.log(req.file);
  console.log(req.body);
  const workbook = xlsx.readFile(`./uploads/${req.file.filename}`);
  //시트명으로 첫번째 시트가져오기.
  //const firstSheetName = xlsx.utils.sheet_to_json(firstSheetName);
  const firstSheetName = workbook.SheetNames[0];
  //첫번째 시트의 데이터를 json값으로 가져온 녀석을 객체로 생성.
  //const firstSheet = workbook.SheetNames[0]; //첫번째 시트.
  const firstSheet = workbook.Sheets[firstSheetName];
  const firstSheetJson = xlsx.utils.sheet_to_json(firstSheet); //시트 데이터를 JSON 배열로 변환해 주는 함수
  console.log(firstSheetJson);
  //반복문 활용.insert
  // firstSheetJson.forEach(async (customer) => {
  //   let result = await mysql.query("cusotmerInsert", customer);
  //   console.log(result);
  // });
  //반복문2.
  const fsj = firstSheetJson //{{a},{b},{k},{b}}
    .sort((a, b) => {
      //sort 두 수 비교하는데 가장 작은 수 될 때까지 반복,음의값이나오도록하면 오름차순.. 양의값이나오도록하면 내림차순
      return a.name < b.name; //오름차순(1,3,4,6), 내림차순(+값이 나오면),두개 결과 값 (-) 오름차순 = a.name-b.name == a.name < b.name
    });
  //정렬된 배열을 다시 생성.
  fsj.forEach(async (customer) => {
    let result = await mysql.query("customerInsert", customer); //await x=>먼저끝난데이터가 들어가짐 순서 엉망
  });
  // .forEach(async (customer) => {
  //   let result = await mysql.query("cutomerInsert", customer);
  // });
  //파일여러개일 경우 1->2
  if (!req.file) {
    res.send("파일 처리가능함.");
  } else {
    res.send("업로드 완료.");
  }
});

//조회
//frontcontrl,url실행컨틀롤러등록한것처럼 요청이들어오면 이 안에 있는걸 실행하겠다.요청방식이 달라지면 다른 crud처리를 하게 됨
app.get("/customers", async (req, res) => {
  //응답정보에 값 전달,모듈로뺌 => insert등 할때 계속호출해줘야하니
  // async function query(alias, values) {
  //   return new Promise((resolve, reject) => {
  //     pool.query(custSql[alias], values, (err, result) => {
  //       if (err) {
  //         console.log("처리중 에러", err);
  //         reject(err);
  //       } else {
  //         console.log(result);
  //         resolve(result);
  //       }
  //     });
  //   });
  // } //end of query.
  //then..cathch빼고 싶으면 함수 앞에다 async 하고
  try {
    let result = await mysql.query("customerList");
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

//insert는 요청정보에 값담아서 전달..
//추가,요청정보가 body 영역에 데이터가 넘어옴..,몸체해석하는기능을 하는게 body-parser
app.post("/customer", async (req, res) => {
  //요청정보에 json형태로 값 전달..,data body영역에 넘어가니 bodyparse설치해야함
  try {
    console.log(req.body.param); //param값이 실제 넘어가면됨,몸체에 넘어오는 param 속성을 db쿼리에 전달
    let data = req.body.param;
    let result = await mysql.query("customerInsert", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
    //에러보게하는법
  }
});

//수정
app.put("/customer", async (req, res) => {
  try {
    let data = req.body.param;
    //let data = [{}, 1]; //배열 안에 객체랑 숫자타입값 전달
    let result = await mysql.query("customerUpdate", data);
    res.send(result);
  } catch (err) {
    res.send("에러발생=>", err);
  }
});
//삭제,body말고 경로에다가 전달하고 싶은 파라미터 정보를 담는다,jquery 할때는 ?로 값 전달했었음
//http://localhost:3000/customer/?id=8&name=Hong&point=23,:id자체가 파라미터,여러개파라미터 전달하고 싶으면 /:(경로변수)
//http://localhost:3000/customer/8/Hong/23,"/customer/:id/:name"
app.delete("/customer/:id", async (req, res) => {
  try {
    //요청정보에params라는 속성을 관리해줌
    // console.log(req.params);
    console.log(req.params);
    //let id = req.params.id;//아이디속성을 변수에 저장
    // let { id, name } = req.params; //{id:8}.아이디에 해당하는 결과값을 받아오는 방식.
    let { id } = req.params;
    //header랑 body영역에 정보 x
    //console.log(id, name); //파라미터 여러개 날리고 싶으면

    let result = await mysql.query("customerDelete", id); //넘버타입을 전달
    //res.send(req.params);postmen에서  params값 확인,[Object: null prototype] { id: '8' }
    res.send(result); //req.로 하니 에러남
  } catch (err) {
    res.send("에러발생=>", err);
  }
});

// mysql
//   //쿼리호출,values값이 x null
//   .query("customerList") //
//   .then((result) => res.send(result)) //처리결과화면에보여줌
//   //실패
//   .catch((err) => res.send("에러발생=>", err));

//서버실행
app.listen(3000, () => {
  console.log("http://localhost:3000 running...!!!");
});

//1.쿼리,2.데이터 2.콜백함수(오류,실행)
//1."select * from customers"
//2."insert into customers(name,email,phone)values(?,?,?)"//user02
//3."insert into customers set ?"
//4."update customers set ? where id = ?"
//4."update customers set ? where id = ?"
//파라미터로 전달할 값은 -> ?(1번째는 1번째 파라미터위치에 값전달)
//affectedRows:반영건수
let data = ["name01", "test@email.com", "010-1111-1111"];
// data = [
//   {// 외부연결하기전 테스트부분
//     name: "username",
//     email: "user@email.com",
//     phone: "010-0101-0101",
//     address: "",
//   },
//   5,
// ];
// console.log(custSql["customerList"]);

// function query(alias, values) {
//   //처리쿼리,처리값
//   //물음표 떨어져있으면 배열로해야함
//   pool.query(
//     // "delete from customers where id = ?", //컬럼이랑 값넣으면 자동으로 넣어줌?
//     //["name01", "test@email.com", "010-1111-1111"],
//     // custSql[customerList],
//     // [4],
//     // //data,
//     // (err, result) => {
//     //   if (err) {
//     //     console.log("처리중 에러", err);
//     //   } else {
//     //     console.log(result);
//     //   }
//     custSql[alias],
//     values,
//     //data,
//     (err, result) => {
//       if (err) {
//         console.log("처리중 에러", err);
//       } else {
//         console.log(result);
//       }
//     }
//   );
// }

//1.쿼리이름 2.전달할 값......
//query("customerList");customerInsert
// query("customerList", {
//   // name: "홍길동",
//   // email: "hong@email.com",
//   // phone: "010-0001-0001",
//   // address: "",
// });
