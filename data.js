//배열선언
const members = [
  { id: "guest", name: "손님" },
  { id: "user", name: "회원" },
  { id: "admin", name: "관리자" },
];

// let add = function add(num1, num2) {
//   return num1 + num2;
// };

//화살표함수,문장하나일시 {},return삭제가능,매개값-실행구문
let add = (num1, num2) => num1 + num2;
//식을반환할때는 생략가능한데,값을 반환할때는 return이 있어야함
let getPerson = () => {
  return {
    firstName: "John",
    lastName: "Doe",
    age: 37,
    email: "john@email.com",
  }; //객체반환
};

//export
module.exports = { members, add, getPerson }; //값할당,다른파일 import가능,중복공통사용내용은파일작성후,값대입하면->require
