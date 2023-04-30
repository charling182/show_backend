'use strict';

// 不开启csrf(跨站攻击)防御,每次请求生成一次太费性能
exports.security = {
  csrf: {
    enable: false,
  },
};

exports.sequelize = {
  dialect: 'mysql',
  host: '123.249.3.134',
  port: 3306,
  username: 'root',
  password: 'forever',
  database: 'egg_charling_pro',
  timezone: '+08:00',
  define: {
    raw: true,
    underscored: false,
    charset: 'utf8',
    timestamp: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
  dialectOptions: {
    dateStrings: true,
    typeCast: true,
    // collate: 'utf8_general_ci',
  },
};
