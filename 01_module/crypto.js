//crypto.js
const { rejects } = require("assert");
const crypto = require("crypto");
const { resolve } = require("path");

let pw = crypto.createHash("sha512").update("pw1234").digest("base64"); //해시값,암호문만드는,항상같은암호문
//실행할때 시점마다 다른값 변화는 구문,역추적(=복호화)이 좀 어려워짐
//console.log(pw);

// let result1 = fetch('url').then(result1 *222).then(dddd);
// let result2 = result1 *222;

//salting암호화.
//함수,비동기->동기,순차적
const createSalt = () => {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(64, (err, buf) => {
      //buf처리결과값들감
      if (err) {
        reject(err);
      }
      resolve(buf.toString("base64"));
    }); //1.파일크기2.함수,(1.에러 2.정상결과값)
  });
};
// createSalt().then(
//   //
//   //(result) => console.log(result.toString("base64"))
//   (result) => console.log(result)
// ); //실행할때마다 다른메소드를  base64(바이너리데이터문자방식->아스키문자로변환)방식으로 만듦.then ,promise일때
//salt:랜덤 난수
//salt방식으로 암호화,pbkdf2암호화하는 함수,planPassword암호화할 평문,salt그때마다 변경되는 암호값,10000 반복 횟수,64문자열길이
const createCryptoPassword = (planPassword, salt) => {
  return new Promise((resolve, reject) => {
    //그때마다 달라지는 초기화salt
    //pbkdf2:무차별대입공격방지관련된
    crypto.pbkdf2(planPassword, salt, 10000, 64, "sha512", (err, key) => {
      //sha256,미국NSA,해시값암호화 길이가 2배 -> sha512(=sha256*2),DB저장시 사용자-회원가입시 같은지 아닌지만 판별,db에는 salt와 password값 둘다있어야함,복호화하는게 아니기에
      if (err) {
        reject(err);
      }
      resolve({ salt: salt, password: key.toString("base64") }); //비밀번호 두개 비교하는값으로 쓰여져야함,객체로넘억
    });
  });
};
//패스워드 생성
async function main() {
  const salt = await createSalt(); //반환값 promise,await..동기방식으로하기위해사용,await잠시기다린다는
  console.log(salt);
  const pw = await createCryptoPassword("1111", salt); //salt변화x createCryptoPassword도 변화x
  console.log(pw.password);
}

main();
