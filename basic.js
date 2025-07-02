//import
//equire 메서드는 먼저 파라미터로 받은 경로값에 위치한 파일을 불러온다
const { members, add } = require("./data.js"); //외부파일(모듈파일),{속성가져옴}
console.log("hello,world");
//변수선언,let or var
let myName = "홍길동";
let age = 20;

//``안에서만 ${}가능
if (age >= 20) {
  //console.log("성인");
  console.log(`${myName}은 성인`);
} else {
  //console.log("미성인");
  console.log(`${myName}은 미성인`);
}
//console.log(members);
//console.log(add(10, 20));

//배열연습
members.forEach((item, idx) => {
  if (idx > 0) {
    console.log(item);
  }
}); //function(item(배열요소),idx,array(배열자체))
