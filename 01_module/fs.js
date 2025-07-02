//fs.js
const fs = require("fs");

console.log("start");
//1.비동기방식.
//읽기,비동기,1.파일위치2.인코딩방식3.읽었을때 정상일때 콜백함수(파일을다읽으면),콜백함수1.에러2.실제정상값
//q에 담겨짐
// fs.readFile("./sample/output.log", "utf8", (err, data) => {
//   if (err) {
//     throw err; //예외처리를 err그냥출력
//   }
//   console.log(data);
// }); //fs.readFileSync();동기방식으로 읽기
// console.log("end");

//2.동기방식
// let data = fs.readFileSync("./sample/output.log", "utf8");
// console.log(data);
// console.log("end"); //여러건처리시 시간지연이 많음

//1.쓰기,뒤에 sync(x)=비동기,파일생성후 쓰기
fs.writeFile("./sample/write.txt", "글쓰기..", "utf8", (err) => {
  if (err) {
    throw err;
  }
  console.log("쓰기완료");
});
console.log("end");

//2.동기방식-98p
