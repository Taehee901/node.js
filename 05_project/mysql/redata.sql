#340p
use dev;
drop table if exists t_category;#해당 테이블이 존재하지 않더라도 오류를 발생시키지 않고 안전하게 테이블을 삭제할 수 있도록 해준다
-- category테이블
 create table t_category(
			  id int(11) unsigned not null auto_increment,#unsigned 컬럼의 데이터 타입이 부호 없는 정수형,auto_increment:새로운 레코드가 추가될 때마다 해당 컬럼의 값이 자동으로 1씩 증가하는 기능으로 고유한 값을 자동생성.
              category1 varchar(100) not null default '',
              category2 varchar(100) not null default '',
              category3 varchar(100) default '',
              primary key(id))
              engine=InnoDB default charset=utf8;# 테이블을 저장하고 처리하는 방법을 지정,현테이블은 utf8 
              
-- image테이블,대문자로 만들어주는 게 뭐지?,쿼리정렬  ctrl+b
drop table if exists t_image;
CREATE TABLE t_image (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    product_id INT(11) UNSIGNED NOT NULL default 0,
    type INT(1) NOT NULL DEFAULT 1 COMMENT '1-썸네일, 2-제품이미지,3-제품설명이미지',
    path VARCHAR(150) NOT NULL DEFAULT '',
    PRIMARY KEY (id),
    KEY product_id (product_id),#key = 인덱스(index)를 만든다는 의미
    CONSTRAINT t_image_ibfk_1 FOREIGN KEY (product_id) #constranint:제약조건,t_image_ibfk_1 :제약조건 이름,t_image에 걸린 
        REFERENCES t_product (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;
             
-- product테이블
drop table if exists t_product;
CREATE TABLE t_product (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(200) NOT NULL DEFAULT '',
    product_price INT(11) NOT NULL DEFAULT 0,
    delivery_price INT(11) NOT NULL DEFAULT 0,
    add_delivery_price INT(11) NOT NULL DEFAULT 0,
    tags VARCHAR(100) DEFAULT NULL,
    outbound_days INT(2) NOT NULL DEFAULT 5,
    seller_id INT(11) UNSIGNED NOT NULL default 0,
    category_id INT(11) UNSIGNED NOT NULL default 0,
    active_yn ENUM('Y', 'N') NOT NULL DEFAULT 'Y',
    create_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP (),
    PRIMARY KEY (id),
    KEY seller_id (seller_id),
    KEY category_id (category_id),
    CONSTRAINT t_product_idfk_1 FOREIGN KEY (seller_id)
        REFERENCES t_seller (id),
    CONSTRAINT t_product_idfk_2 FOREIGN KEY (category_id)
        REFERENCES t_category (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;



alter table t_product alter column seller_id set default 0; 
alter table t_product alter column category_id set default 0; 

-- seller테이블
drop table if exists t_seller;
CREATE TABLE t_seller (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL DEFAULT '',
    email VARCHAR(100) NOT NULL DEFAULT '',
    phone VARCHAR(20) NOT NULL DEFAULT '',
    PRIMARY KEY (id)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;
             
-- user테이블
drop table if exists t_user;
CREATE TABLE t_user (
    email VARCHAR(50) NOT NULL DEFAULT '',
    type INT(1) NOT NULL DEFAULT 1 COMMENT '1-buyer,2-seller',
    nickname VARCHAR(50) DEFAULT NULL,
    PRIMARY KEY (email)
)  ENGINE=INNODB DEFAULT CHARSET=UTF8;

-- sample 데이터(상품,카테고리,이미지)
select *
from t_product;

select *
from t_user;

SHOW CREATE TABLE t_user;
SHOW WARNINGS;

-- 상품데이터
insert into t_product(product_name,product_price,delivery_price,seller_id,category_id)
values('LG 마우스',15000,3000,1,2); #.. 나는 2번을 DB에 마우스카테고리로 저장이라서 2번인 교수님과 다름.

insert into t_product(product_name,product_price,delivery_price,seller_id,category_id)
values('Logitec 마우스',18000,3000,1,2);

delete from t_product
where id = 4;



select *  from t_product;

select *
from t_image;

delete from t_image
where id = 11;

insert into t_image(product_id,type,path)
values(1,1,'upload/2/thumnail.jpg'); 

insert into t_image(product_id,type,path)
values(2,1,'upload/3/thumnail2.jpg');

delete from t_image
where id = 3;

select *
from  t_user;


select *
from t_seller;
-- seller테이블 참조하는 값을 가져와야해서 seller_id,category_id에 값을 지정해줘야함
insert into t_seller(name,email,phone)
values('seller01','01@email.com','010-0000-0000');

-- 프로덕트 외래키 2 category
select *
from t_category;

-- 컴>주요>메인보드식 카테고리,다나와 생각
insert into t_category(category1,category2,category3)
values('컴퓨터','주요부품','메인보드1');

insert into t_category(category1,category2,category3)
values('컴퓨터','주변기기','마우스');

delete from t_category
where id = 1;

-- 상품 목록,concat:문장연결하는 함수,join
select concat(c.category1,'/',c.category2,'/',c.category3)
	   as category
       #,p.*
       ,p.id
       ,p.product_name
       ,p.delivery_price
       ,i.*
from  t_product p
join  t_category c
on p.category_id = c.id
left join t_image i
on p.id = i.product_id
and i.type = 1;
-- where p.product_name = 'LG 마우스'; -- 메인이미지.

#productDetail관련부분
-- select t1.*,t2.path,t3.category1,t3.category2,t3.category3
-- from   t_product t1, t_image t2, t_category t3
-- where  t1.id >0
-- and    t1.id = t2.product_id
-- -- and    t2.type =  3 
-- and    t2.type =  1
-- and t1.category_id = t3.id


select t1.*,t2.path,t3.category1,t3.category2,t3.category3
           from t_product t1, t_image t2, t_category t3
           where t1.id = t2.product_id
           and   t2.type = 1
           and   t1.category_id = t3.id;
-- 실 경로x,이미지 이름만경로까지 다 들어가면 안됨 ,product_id =2 + 3 =>  node.js update 폴더에 맞게 변경          
select * from t_image;

update t_image
set path = 'keyboard.jpg'
where id = 13;

update t_image
set path = 'keyboard2.jpg'
where id = 12;

# 외래키 >4번 x -> 수정x ,node upload파일을 product_id에 맞게 폴더명을 4->1 수정
-- t_image 먼저 수정
UPDATE t_image SET product_id = 4 WHERE product_id = 1;

-- 그 다음 t_product 수정
UPDATE t_product SET id = 4 WHERE id = 1;

select *
from t_product;
                                      
#productDetail
select t1.*,t2.path,t3.category1,t3.category2,t3.category3
            from   t_product t1, t_image t2, t_category t3
            where  t1.id = 2
            and    t1.id = t2.product_id
            and    t2.type =  1
            and t1.category_id = t3.id;
            
-- 2번 상품에 type:2 ,slide1.jpg,slid2.jpg,slide3.jpg
insert into t_image(product_id,type,path)
values (2,2,'slide1.jpg'),(2,2,'slide2.jpg'),(2,2,'slide3.jpg');

-- 2번 상품의 type:3,productDesc.jpg ,product.js 대표이미지관련 쿼리문을 일단 1->3번으로 변경하여 설명이미지가 나오도록함
insert into t_image(product_id,type,path)
values (2,3,'productDesc.jpg');

select * from t_image
where product_id = 2;
