//promise.js,매개값을받는데함수로받음
//58p,1.정상잘실행했을때호출함수,2.실행하다 예외,에러발생했을때호출할 함수
const prmise = new Promise(function (resolve, reject) {
  let run = parseInt(Math.random() * 2); //0~2사이의 임의의 값 생성,소수점제거 -> 0 or 1
  //falsy -> 0,null,"",undefied 이외에는 truty.
  //xmlhttprequest,fetch-자바
  //변수이름에따른게아니라 위치에 따라 결정,1 성공 매개함수2.실패시 매개함수
  //resolve("ok"); //에러x정상실행되면 성공했을때 들어온 매개함수에다 ok라는 매개값을 전달,then메소드 resolve매개값을 전달
  //reject("error"); //catch메소드가 결과를 받음
  setTimeout(function () {
    if (run) {
      resolve({ id: "user", name: "회원" }); //서버로부터정보가져옴,prmise값에따라
    } else {
      reject(new Error("에러호출"));
    }
    //매개값2개,1.함수,2.지연시간 ms
    //   reject({ id: "user", name: "회원" }); //promise에러발생시,전달되는값이 문자가아닐수도 o"error"
    // }, 1000);
  }, 1000);
});
//then메소드가 처리결과받음
prmise //어떤값반환할지.., fetch..then..then..catch
  .then(function (result) {
    //resolve
    console.log(result);
  })
  .catch(function (err) {
    //rejects
    console.log(err);
  });

//07.03일 예정
// // //postMan
// //ajax.call
// fetch(
//   "https://charleslee-6617723.postman.co/workspace/3461b914-2d4f-41c9-8c64-f24308da11f5/request/45560951-edf6f244-dc04-42e6-a962-02a67c0332d1?action=share&source=copy-link&creator=45560951&ctx=documentation"
// ) //
//   .then((json) => json.json()) //
//   .then((result) => {
//     console.log(result);
//   })
//   .catch((err) => console.log(err));
