const url = new URL(
  "https://user:pass@sum.example.com:8080/a/b/c?query=name&num=1#node"
); //속성을 분리해서 결과를 보여줌
const params = url.searchParams;
console.log(params.get("query")); //속성,파라미터 get에해당되는 query=name
console.log(params.get("num"));
//console.log(url);//객체
