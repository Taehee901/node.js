module.exports = {
  //객체반환,=?는 잘못된 쿼리문
  customerList: "select * from customers",
  customerInsert: "insert into customers set  ?",
  customerUpdate: "update customers set ? where id =?",
  customerDelete: "delete from customers where id = ?",
};
