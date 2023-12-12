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
  // host: '127.0.0.1',
  // port: 33066,
  username: 'root',
  password: 'forever',
  database: 'egg_charling_pro',
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
  },
};

exports.redis = {
  client: {
    port: 6379,
    host: '123.249.3.134',
    // host: '127.0.0.1',
    password: '123123',
    db: 1,
  },
};

exports.io = {
  init: {
    pingTimeout: 10000, // 10 seconds
    pingInterval: 25000, // 25 seconds
    // transports: ['websocket'],
    // pingInterval: 5000,
    // allowEIO3: true,
  }, // passed to engine.io
  namespace: {
    '/': {
      connectionMiddleware: ['connection'],
      packetMiddleware: ['packet'],
    },
  },
  redis: {
    host: '123.249.3.134',
    // host: '127.0.0.1',
    port: 6379,
    password: '123123',
    db: 3,
  },
  generateId: req => {
    // 自定义 socket.id 生成函数
    // const data = qs.parse(req.url.split('?')[1]);
    return `${req._query.userId}_${uuidv4()}`; // custom id must be unique
  },
};
