# postmanBook

>[courier]
>这是一个'全栈'项目,
>快递员计件统计系统,
>在比较落后的地区,快递员的薪酬统计方式是比较原始和辛苦的,
>所以做这个简易的系统使用!
>微信小程序也在筹备中...

## Build Setup

``` bash
修改根目录`config.default.js`为`config.js`并做好配置信息

# install dependencies
$ npm run install

# serve with hot reload at localhost:3000
$ npm run dev

# build for production and launch server
$ npm run build
$ npm run start

# generate static project
$ npm run generate
```

## 建表
```
SET FOREIGN_KEY_CHECKS=0;
DROP TABLE IF EXISTS `couriers`;
CREATE TABLE `couriers` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `courier_id` int(11) NOT NULL,
  `courier_name` varchar(255) NOT NULL,
  `big` tinyint(1) DEFAULT NULL,
  `small` tinyint(1) DEFAULT NULL,
  `is_del` tinyint(4) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `uid` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `nickname` tinytext,
  `register_time` date DEFAULT '2019-01-01',
  `gender` tinyint(4) DEFAULT '0',
  `age` tinyint(4) DEFAULT '18',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;
DROP TABLE IF EXISTS `record`;
CREATE TABLE `record` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `record_id` varchar(255) NOT NULL,
  `courier_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `size` tinyint(4) NOT NULL,
  `time` datetime(6) NOT NULL,
  `image` varchar(510) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=127 DEFAULT CHARSET=utf8mb4;
DROP TABLE IF EXISTS `courier_price`;
CREATE TABLE `courier_price` (
  `courier_id` int(11) NOT NULL,
  `big` smallint(6) DEFAULT NULL,
  `small` smallint(6) DEFAULT NULL,
  PRIMARY KEY (`courier_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).

## 技术栈
``` bash
nuxt + axios + antDesigne + vue + vueRouter + koa + koa-session + node-mysql + eslint
```
