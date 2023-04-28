'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your config here
  config.middleware = [];
  // swaggerdoc config
  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'Example API',
      description: 'Example API for egg-swagger-doc',
      version: '1.0.0',
    },
    schemes: [ 'http', 'https' ],
    consumes: [ 'application/json' ],
    produces: [ 'application/json' ],
    enableSecurity: false,
    routerMap: true,
    enable: true,
  };

  // jwt config
  config.jwt = {
    secret: 'memory',
    ignore: [ '/backend/login', '/backend/register', '/backend/logout', '/backend/configuration/public_key' ], //登录,注册,登出不需要验证
    expiresIn: '1d',
    tokenName: 'Authorization',
    tokenType: 'Bearer',
  };

  // mail config
  config.mailer = {
    host: 'smtp.qq.com',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: '1650070770@qq.com', // generated ethereal user
      pass: 'bbevjsggjbuwhaai', // generated ethereal password
    },
  };

  config.static = {
    prefix: '/public/',
    dir: path.join(appInfo.baseDir, '/public'),
  };

  // change to your own sequelize configurations
  // config.sequelize = {
  //   dialect: 'mysql',
  //   host: 'localhost',
  //   port: 3306,
  //   database: 'egg-sequelize-default',
  //   username: 'root',
  //   password: '',
  // };


  return config;
};
