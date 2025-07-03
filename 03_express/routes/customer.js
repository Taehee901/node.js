const express = require("express"); //라우팅관리해주는클래스가모듈안에포함
const router = express.Router();
//라우팅 정보 생성

//조회,요청방식에따라 insert가능
router.get("/customers", (req, res) => {
  res.send("/customer 루트디렉토리");
});
//등록
router.post("/insert", (req, res) => {
  res.send("/customer POST요청.");
});
//수정
router.put("/update", (req, res) => {
  res.send("/customer PUT요청.");
});
//삭제
router.delete("/delete", (req, res) => {
  res.send("/customer DELETE요청.");
});
module.exports = router;
