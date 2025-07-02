//import
//equire 메서드는 먼저 파라미터로 받은 경로값에 위치한 파일을 불러온다
const { members, add, getPerson } = require("./data.js"); //외부파일(모듈파일),{속성가져옴}
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

//배열을 펼쳐서 배열안 요소 하나씩 꺼내서 새로운 배열만들어주는걸 확인할수o ...
let arr1 = [1, 2, 3];
let arr2 = [4, 5, 6];
let result = [arr1, arr2]; //[ [ 1, 2, 3 ], [ 4, 5, 6 ] ]
//let result = [...arr1, ...arr2];//[ 1, 2, 3, 4, 5, 6 ]
console.log(result);

//Object Destructuring
//함수,객체반환
//let person = getPerson();
let { firstName, lastName, email } = getPerson(); //{fn,ln...},firstname에 해당되는값을 속성으로 선언하면 변수에 해당되는 값이 할당되는것을확인할수 o,객체->객체로 값(어떤걸 전달해줄지는모름)
console.log(firstName, lastName, email); //John Doe john@email.com

//Array Destructuring
function getScores() {
  return [70, 80, 90, 50, 60, 40]; //배열반환
}

//Rest Parameter
let [x, y, ...z] = getScores(); //값을 하나씩 할당,...z=>크기를알수없고 나머지값들을 다 담아서 가져온다,70 80 [ 90, 50, 60, 40 ]
//let scoreAry = getScores(); x
//scoreAry[idx]
console.log(x, y, z); //70 80 90[x,y,z],펼침연산자:[90,60,50]=>90,60,50
// function sumAry(ary = []) {
//   let sum = 0;
//   for (let num of ary) {
//     sum += num;
//   }
//   console.log(`합계:${sum}`);
// }
// sumAry(z);
//num1,num2는 매개변수 2개,...ary 매개변수가몇개인지 알수x
function sumAry(...ary) {
  //배열은x배열처럼사용가능
  //매개변수의 파라미터의 갯수를 알수 x,펼침연산자가 파라미터로쓰여지면
  let sum = 0;
  for (let num of ary) {
    sum += num;
  }
  console.log(`합계:${sum}`);
}
sumAry(1, 2, 3, 4, 5, 6, 7, 8);
