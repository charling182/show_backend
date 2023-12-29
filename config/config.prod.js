'use strict';

const { v4: uuidv4 } = require('uuid');

// 不开启csrf(跨站攻击)防御,每次请求生成一次太费性能
exports.security = {
  csrf: {
    enable: false,
  },
};
// 日志
exports.logger = {
  level: 'DEBUG',
  // 其他配置...
};

exports.sequelize = {
  dialect: 'mysql',
  host: process.env.MySqlHost || '127.0.0.1',
  port: process.env.MySqlPort || 3306,
  username: process.env.MySqlUserName,
  password: process.env.MySqlPassword,
  database: process.env.MySqlDatabase,
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
  pool: {
    max: 5, // 连接池中最大连接数量
    min: 0, // 连接池中最小连接数量
    acquire: 30000, // 连接池尝试获取连接之前的最大等待时间（毫秒）
    idle: 10000 // 连接在被释放之前可以空闲的最长时间（毫秒）
  }
};

exports.redis = {
  client: {
    port: process.env.RedisPort || 6379,
    host: process.env.RedisHost || '127.0.0.1',
    password: process.env.RedisPassword,
    db: process.env.RedisDb || 1,
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
    host: process.env.RedisHost || '127.0.0.1',
    port: process.env.RedisPort || 6379,
    password: process.env.RedisPassword,
    db: 3,
  },
  generateId: req => {
    // 自定义 socket.id 生成函数
    // const data = qs.parse(req.url.split('?')[1]);
    return `${req._query.userId}_${uuidv4()}`; // custom id must be unique
  },
};

