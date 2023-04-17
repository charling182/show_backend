'use strict';

exports.sequelize = {
  dialect: 'mysql',
  host: '127.0.0.1',
  port: 33066,
  username: 'charling',
  password: '18240542192',
  database: 'egg_charling_dev',
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
