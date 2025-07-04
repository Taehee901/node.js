//app.js,mysql안되는 이유->
// const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "./sql/.env" }); //env 파일 경로를 path지정

//환경변수읽어올때
console.log(process.env.HOST);
console.log(process.env.USER);
const mysql = require("./sql"); //index.js는생략가능해서 폴더이름만 작성해줘도 된다. ./sql/index

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
//에러발생,new

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

    let result = await mysql.query("cutomerDelete", id); //넘버타입을 전달
    //res.send(req.params);postmen에서  params값 확인,[Object: null prototype] { id: '8' }
    req.send(result);
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
