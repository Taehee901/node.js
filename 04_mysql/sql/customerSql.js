module.exports = {
  //객체반환,=?는 잘못된 쿼리문
  customerList: "select * from customers", //1146 에러발생,테이블이름잘못작성
  customerInsert: "insert into customers set  ?", //?=>오라클 x (values)->mysql에서만 사용 가능
  customerUpdate: "update customers set ? where id =?", //1.객체타입 2.숫자타입
  customerDelete: "delete from customers where id = ?",
};
