const nodemailer = require("nodemailer");
//require('dotenv').config({path:})
//사용방식->
const config = {
  host: "smtp.daum.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.DAUM_EMAIL,
    pass: process.env.DAUM_APP_PASSWORD,
    // user: "taehui5859@daum.net", //id@daum.net,
    // pass: "vbfcmqkfnkadtael", //app pw,일회용 pw
  },
  //app 비밀번호를 발급,계정비번 x
};
//1.function or =>
const sendEmail = async (data) => {
  //Promise객체로 반환.
  return new Promise(async (resolve, reject) => {
    //메일생성
    let tp = nodemailer.createTransport(config);
    try {
      let result = await tp.sendMail(data);
      console.log("메일성공", result);
      resolve(result);
    } catch (err) {
      console.log("메일실패", err);
      reject(err);
    }
  });
  // //메일생성
  // let tp = nodemailer.createTransport(config);
  // try {
  //   let result = await tp.sendMail(data);
  //   console.log("메일성공", result);
  // } catch (err) {
  //   console.log("메일실패", err);
  // }
};
// //메일생성
// let tp = nodemailer.createTransport(config);
// tp.sendMail({
//   //발신자,메일 발송이름 "id@daum.net"
//   from: "taehui5859@daum.net",
//   //수신자
//   to: "xozlfl789@naver.com", //process.env.DAUM_EMAIL
//   // to:"cholee@yedam.ac"
//   subject: "mail 연습",
//   text: "메일이 잘 가는지 연습하고 있어요...",
//   html: "<b>강조</b>하고자하면....",
// });

module.exports = {
  sendEmail, //비동기처리
};
