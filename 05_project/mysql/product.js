//const { query } = require(".");
//338p.필요쿼리 만듦``해야하는이유,오타 주의 필요 ->상품목록2 -> sselect
//TypeError: Cannot read properties of undefined (reading 'query') =>  module.export 오타가 원인이었다.

const { query } = require(".");

//? 자리에 들어갈 값을 배열로 전달하면 자동으로 이스케이프 처리돼서 Injection 방지됨.
module.exports = {
  //const { query } = require(".");
  //todo목록.
  todoList: {
    query: `select * from tbl_todo`,
  },
  //todo삭제
  todoDelete: {
    query: `delete from tbl_todo where id = ?`,
  },

  //상품 목록.
  productList: {
    query: `select t1.*,t2.path,t3.category1,t3.category2,t3.category3
           from t_product t1, t_image t2, t_category t3
           where t1.id = t2.product_id
           and   t2.type = 1
           and   t1.category_id = t3.id`,
  },
  //상품 등록할 때,상품목록2.
  productList2: {
    query: `select t3.*,t4.path
            from (select t1.*,t2.category1,t2.category2,t2.category3
                  from t_product t1,t_category t2)
                  where t1.category_id = t2.id) t3
            left join (select * from t_image where type = 1) t4
            on t3.id = t4.product_id`,
  },
  //상품상세.,이미지 타입을 다 1로 해두었기에 3->1(썸네일기준)
  productDetali: {
    query: `select t1.*,t2.path,t3.category1,t3.category2,t3.category3
            from   t_product t1, t_image t2, t_category t3
            where  t1.id = ?
            and    t1.id = t2.product_id
            and    t2.type =  1
            and t1.category_id = t3.id`,
  },
  //슬라이드형식 이미지들
  productMainImages: {
    query: `select *
             from   t_images
             where  product_id = ?
             and    type = 2`,
  },
  //상품등록
  productInsert: {
    query: `insert into t_product set ?`,
  },
  //상품이미지 등록.
  productImageInsert: {
    query: `insert into t_image set ?`,
  },
  //이미지 리스트.
  imageList: {
    query: `select * 
           from   t_image
           where  product_id=?`,
  },
  //상품이미지 삭제.
  imageDelete: {
    query: `delete from t_image
           where  id=?`,
  },
  //상품삭제
  productDelete: {
    query: `delete from t_product
           where id = ?`,
  },
  //카테고리 리스트
  categoryList: {
    query: `select *
           from  t_category`,
  },
  categoryInsert: {
    query: `insert into t_category set ?`,
  },
  //판매자 리스트
  sellerList: {
    query: `select *
           from  t_seller`,
  },
  //회원가입,동일키 들어가면 업데이트 아닐경우 추가

  signUp: {
    query: `insert into t_user set ? on   duplicate key  update ?`,
  },
  // signUp: {
  //   query: `insert into t_user set ?
  //           ON DUPLICATE KEY UPDATE
  //           email = VALUES(email),
  //           type = VALUES(type),
  //           nickname = VALUES(nickname);`,
  // },
};
