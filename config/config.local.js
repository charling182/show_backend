'use strict';

// 不开启csrf(跨站攻击)防御,每次请求生成一次太费性能
exports.security = {
  csrf: {
    enable: false,
  },
};

exports.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 33066,
  username: 'charling',
  password: '18240542192',
  database: 'egg_charling_dev',
  timezone: '+08:00',
  define: {
    raw: true, // 使用原始查询,不开启的话,则返回的数据可能包含了 Sequelize 额外添加的一些属性字段
    underscored: true, // 字段以下划线（_）来分割（默认是驼峰命名风格）
    charset: 'utf8',
    timestamp: true, 
  },
  dialectOptions: {
    dateStrings: true, 
    typeCast: true,
    // collate: 'utf8_general_ci',
  },
};
