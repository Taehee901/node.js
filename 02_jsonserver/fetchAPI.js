//fetchAPI.js,ajax만 씀.jsp
fetch("http://localhost:3000/post/9", {
  //두번째매개값 옵션
  method: "delete", //어떤값 등록,body영역에 데이터넘김
  // headers: { "Content-Type": "application/json" },
  // body: JSON.stringify({ id: 9, title: "fetch연습", author: "admin" }),
  // method: "post", //어떤값 등록,body영역에 데이터넘김
  // headers: { "Content-Type": "application/json" },
  // body: JSON.stringify({ id: 9, title: "fetch연습", author: "admin" }),
})
  //text값가져오는거
  .then((resolve) => resolve.text())
  // .then((resolve) => resolve.json())
  .then((result) => {
    console.log(result);
  })
  .catch((err) => console.log(err));
