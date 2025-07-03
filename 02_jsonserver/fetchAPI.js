//fetchAPI.js,ajax만 씀.jsp,책104~108p
async function json_func() {
  //async는 await사용시
  //함수는 정의되었다고 실행x호출해야 실행
  try {
    let proimse = await fetch("http://localhost:3000/posts/3", {
      //함수,키워드
      //promise객체타입 값 반환하기에 fetch..then가능
      //http://localhost:3000/posts/3 ->delete,put일 경우 파라미터 필요
      //두번째매개값 옵션
      method: "put",
      // method: "post",
      // method: "delete", //어떤값 등록,body영역에 데이터넘김,deltete는 header랑 body부분 필요x
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: 3, //""->String변경
        title: "2번수정fetch5연습",
        author: "admin",
      }),
      // method: "post", //어떤값 등록,body영역에 데이터넘김
      // headers: { "Content-Type": "application/json" },
      // body: JSON.stringify({ id: 9, title: "fetch연습", author: "admin" }),
    });
    let resolve = await proimse.json(); //json promise값 반환하니 await사용가능,자바스크립트 객체타입으로 변환
    console.log("결과=>", resolve); //  let result = awaitx->반환값x

    proimse = await fetch("http://localhost:3000/posts");
    resolve = await proimse.json(); //배열관련메소드를알고있으면좋음,여러데이터처리해야하니
    console.log("조회=>", resolve);
  } catch (err) {
    console.log(err);
  }
  //text값가져오는거
  //.then((resolve) => resolve.text())
  //.then((resolve) => resolve.json())
  // .then((result) => {
  // console.log("결과=>", result); //삭제결과
  // return fetch("http://localhost:3000/posts"); //리턴생략시fetch()..then()..then()형태로 여기서 사용 후 콘솔(result)밑에 또 fetch()..then..then
  //})
  //=>리턴
  //.then((resolve) => resolve.json()) //조회결과
  //.then((result) => console.log(result))
  //.catch((err) => console.log(err));
}
json_func(); //호출
