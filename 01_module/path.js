//path.js
const path = require("path");

console.log(__filename); //파일경로
console.log(path.basename(__filename));
console.log(path.basename(__filename, ".js")); //파일이름만 남기고 싶으면 , ".js"

let result = path.format({
  //각각속성조합해서 파일만들어주는거
  base: "sample.txt",
  dir: "/home/temp",
});
console.log(result); ///home/temp\sample.txt,윈도우라 파일경로\ x -> 원달러로 표시

//반대
result = path.parse("/home/temp/sample.txt"); //속성구분
console.log(result); //ext확장자
