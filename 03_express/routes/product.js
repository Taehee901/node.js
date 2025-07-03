const { Router } = require("express"); //라우팅관리해주는클래스가모듈안에포함 중 라우터만 클래스만 씀
const router = Router(); //Router클래스만 씀
//라우팅 정보.

//조회,요청방식에따라 insert가능
router.get("/products", (req, res) => {
  res.send("/product 루트디렉토리");
});
//등록
router.post("/insert", (req, res) => {
  res.send("/product POST요청.");
});
//수정
router.put("/update", (req, res) => {
  res.send("/product PUT요청.");
});
//삭제
router.delete("/delete", (req, res) => {
  res.send("/product DELETE요청.");
});
module.exports = router;
