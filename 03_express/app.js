//import하는건 위에 어떤모듈쓰는지 알수 있게
//117p
//fetchapi사용 위해 json-server --watch db.json 서버를 실행 시켰을경우 같은 포트를 사용하기에 먼저 꺼져야함
const express = require("express");
const fs = require("fs");
//req실 요청파라미터,json 등 전달x->해석기능
const bodyParser = require("body-parser");
//npm install multer,셋팅값2 1.파일경로 2.업로드 서버 중복이름 오버라이트x 리네임
const multer = require("multer");
const path = require("path"); //경로지정하는 내장모듈
const cors = require("cors");
const customerRoute = require("./routes/customer");
const productRoute = require("./routes/product");
const app = express(); //express서버의 instance생성,서버추가적인기능은 p128,미들웨어

//application/json요청 ->body정보요청,post,put등 get(x)
app.use(bodyParser.json()); //파싱정보담음,몸체해석
//application/x-www-form-urlencoded()
//app.use(bodyParser.urlencoded()); //{ id: 'home', name: 'admin' }
app.use(bodyParser.urlencoded({ extended: true })); //중첩된 객체로 표현하는거 허용하겠습니까?extended,false or true 상관x

//파일업로드.multer.diskStorage함수에 옵션 넣어줘야함
//저장경로와 파일명 지정.
const storage = multer.diskStorage({
  //요청정보,업로드파일정보,정상업로드콜백함수
  destination: function (req, file, cb) {
    //저장경로옵션
    cb(null, "uploads"); // "/uploads",절대경로로 하니 D드라이브로 올라가지며,Error: ENOENT: no such file or directory, open 'D:\uploads\1751512430352_ddddd.txt'
  },
  //파일이름중복 방지,저장파일이름
  filename: function (req, file, cb) {
    //업로드되는 파일명.새로지정,동일파일존재xDate.now현재시간 덧붙여서,1970년0시0분부터시작data.now
    let fn = Buffer.from(file.originalname, "latin1").toString("utf-8"); //한글처리
    cb(null, Date.now() + "_" + file.originalname); //ex) sample.jpg 중복 오버라이딩 -->121212131_sample.jpg
  },
});

//Multer 인스턴스 생성.
const upload = multer({
  storage: storage, //저장공간
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: function (req, file, cb) {
    const mimetype = /jpg|jpeg|png|gif/.test(file.mimetype); // /jpg|jpeg|png|gif/표현식객체에 mimetype속성값에 여부를 확인해서 업로드한 파일이 이미지인지 검사해서 해당파일만 걸러줌
    if (mimetype) {
      return cb(null, true);
    }
    return cb(null, false);
  },
});
//동일출처 원칙.,http://192.168.56.1:5500/이건 개인,여기서 들어오는 정보는 localhost:3000번과 동일하게 보겠다는 의미
app.use(cors({ origin: "http://192.168.56.1:5500/" })); //경로이름이달라서현재는안됨,

//req요청정보 res응답정보-핸들러,페이지엶
app.get("/", (req, res) => {
  //frot컨트롤러처럼 경로만들어주는거
  //get으로 요청들어올때..,라우팅 사용자요청-,경로설정url-실행함수(보여줄페이지) 매칭하는거
  //get방식으로 요청할때 실행되는 라우터를 등록
  // "/"  url 경로
  fs.readFile("./public/index.html", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  }); //1.파일경로,2.인코딩방식3.콜백함수(err,보고싶은 값(정상값))
  //res.send("Server Start");
});

//첨부파일 업로드 화면.
app.get("/upload", (req, res) => {
  fs.readFile("./public/upload.html", "utf-8", (err, data) => {
    if (err) {
      res.send(err);
    }
    res.send(data);
  });
});

//express에서 에러처리하는 미들웨어.
app.use((err, req, res, next) => {
  console.log("error", err, req, res);
  next();
});

//첨부처리.,multer파일,요청경로가,여러개면 배열메소드호출,하나만 처리하면 single 파일하나만 처리하는 함수->array대체할 경우
//app.post("/upload", upload.single("myFile"), (req, res) => {
app.post("/upload", upload.array("myFile"), (req, res) => {
  //네임속성을파라미터로받음
  //console.log(req.file); //업로드된 파일의 정보.,예외발생  upload.single("myFile")
  console.log(req.files); //단건은 file
  console.log(req.body); //요청몸체의 정보.
  if (!req.files) {
    res.send("이미지 처리가능함.");
  } else {
    res.send("업로드 완료.");
  }
});

// //동일출처원칙.//모든 서버에서의 요청허락orgin({orgin:})특정서버만접근가능하게하는거
app.use(cors()); //어떤클라이언트요청이들어와도다허락
// app.get("http://localhost:3000/getCors", (req, res) => {
//   let result = { id: "user01", name: "Hong" };
//   res.json(result);
// });

//get방식은 엔터 url
// app.get("/customer", (req, res) => {
//   res.send("/customer경로입니다.");
// });
// //post 요청,send 기본적으로 텍스트값을 반환해줌
// app.post("/customer", (req, res) => {
//   //res.send("/customer경로의 post요청입니다.");
//   res.json({ id: 10, name: "hongkildong" }); //json형태의 값
// });

//json,bodyParse를 활용해서 요청정보의 body정보를 해석.
app.post("/json-data", (req, res) => {
  //key-value형식 객체 타입 req.body.name or req.body.id =>name or id값만
  console.log(req.body); //요청대상의 몸체에넘어온값을처리
  res.send("json요청");
});

//form데이터요청처리
app.post("/form-data", (req, res) => {
  //key-value형식 객체 타입 req.body.name or req.body.id =>name or id값만
  console.log(req.body); //요청대상의 몸체에넘어온값을처리
  res.send("form-data요청");
});
//라우팅정보를 파일로 분리.DB연습할때..?
app.use("/cutomer", customerRoute);
app.use("/product", productRoute);

app.listen(3000, () => {
  console.log("http://localhost:3000서버실행"); //서버만 실행,루트경로에다가 치면 메시지 보여줌 라우팅 -실행함수와 연결시키는거
}); //3000포트 실행,라우터는 서버 엔터치면 보여지는
