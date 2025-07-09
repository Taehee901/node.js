//query 모듈 crud 할때마다 호출 힘듦,같은경로라서 폴더 뺌"./sql/customerSql"
//mysql과 관련된 것들
const mysql = require("mysql2");
const sql = require("./product.js"); //.js가 존재해도되고안해도상관 x
//직접정보 x - DB연결을 아래와 같이 환경변수에 등록된 값 이름을  불러오는 걸로 사용해야 한다
//보안요구하는 정보들...(외부노출x 새파일에 정보생성후 ->환경변수에 값 할당하여 처리 ->git 오픈할 경우 위험 가능성 git 숨김설정)
//세션여러개담는
const pool = mysql.createPool({
  //환경변수
  host: process.env.HOST,
  port: process.env.PORT,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  connectionLimit: process.env.LIMIT,
});
//객체반환
//추가적인쿼리를 달고싶을경우 전달하면됨.pool쿼리가 들어오는데 에러일경우 에러값,옳을경우 result 값"order by 1""
async function query(alias, values = [], where = "") {
  //2.값3.추가적 쿼리
  //alias:product.js에서만든 객체
  //alias:productList.query=>쿼리내용들고옴.
  return new Promise((resolve, reject) => {
    console.log(sql["productList"].query + where); //쿼리,추가쿼리, 전달할 겂
    pool.query(sql[alias].query + where, values, (err, result) => {
      if (err) {
        console.log("처리중 에러", err);
        reject(err);
      } else {
        console.log(result);
        resolve(result); //then메스드에 의해 나타난 결과값이 성공할 경우
      }
    });
  });
} //end of query.

module.exports = { query }; //다른 파일 import 사용가능
