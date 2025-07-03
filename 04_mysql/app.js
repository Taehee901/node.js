//app.js,mysql안되는 이유->
const mysql = require("mysql2");
const custSql = require("./sql/customerSql"); //반환 객체,{customerList,customerIn~}
//pool 데이터베이스를 사용반환반복{db정보넣어주면됨}
const pool = mysql.createPool({
  host: "127.0.0.1",
  port: 3306,
  user: "dev01",
  password: "dev01",
  database: "dev",
  connectionLimit: 10,
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
data = [
  {
    name: "username",
    email: "user@email.com",
    phone: "010-0101-0101",
    address: "",
  },
  5,
];
console.log(custSql["customerList"]);
function query(alias, values) {
  //처리쿼리,처리값
  //물음표 떨어져있으면 배열로해야함
  pool.query(
    // "delete from customers where id = ?", //컬럼이랑 값넣으면 자동으로 넣어줌?
    //["name01", "test@email.com", "010-1111-1111"],
    // custSql[customerList],
    // [4],
    // //data,
    // (err, result) => {
    //   if (err) {
    //     console.log("처리중 에러", err);
    //   } else {
    //     console.log(result);
    //   }
    custSql[alias],
    values,
    //data,
    (err, result) => {
      if (err) {
        console.log("처리중 에러", err);
      } else {
        console.log(result);
      }
    }
  );
}
//1.쿼리이름 2.전달할 값......
//query("customerList");
query("customerInsert", {
  name: "홍길동",
  email: "hong@email.com",
  phone: "010-0001-0001",
  address: "",
});
