'use strict';

const path = require('path');

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_{{keys}}';

  // add your middleware config here
  config.middleware = ['jurisdictionHandler', 'errorHandler', 'logHandler'];

  // swaggerdoc config
  config.swaggerdoc = {
    dirScanner: './app/controller',
    apiInfo: {
      title: 'Example API',
      description: 'Example API for egg-swagger-doc',
      version: '1.0.0',
    },
    schemes: ['http', 'https'],
    consumes: ['application/json'],
    produces: ['application/json'],
    enableSecurity: true,
    routerMap: false, // (实验功能)注释中有@router时,一旦开启会自行生成路由表,而且会覆盖写好的路由表,此时接口类型以注释为主
    enable: true,
    securityDefinitions: {
      apikey: {
        type: 'apiKey',
        name: 'Authorization',
        in: 'header',
      },
      oauth2: {
        type: 'oauth2',
        tokenUrl: 'http://127.0.0.1:7001/backend/user/login',
        flow: 'password',
        scopes: {
          'write:access_token': 'write access_token',
          'read:access_token': 'read access_token',
        },
      },
    },
  };

  // jwt config
  config.jwt = {
    secret: 'memory',
    ignore: [
      '/backend/user/login',
      '/backend/user/register',
      '/backend/user/logout',
      '/backend/configuration/public_key',
      '/backend/verification_code',
      '/backend/user/password',
      '/backend/task_states/list',
      '/backend/task_types/list',
      '/backend/task_prioritys/list',
      '/backend/task_tags/list',
    ], //登录,注册,登出不需要验证
    expiresIn: '1d',
    tokenName: 'authorization',
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
    prefix: '/public/', // 这里的 prefix 是 URL 前缀，例如 /public，表示访问静态文件时需要添加 /public 前缀；
    dir: `${appInfo.baseDir}/public`, // dir 是静态文件目录，例如 ${appInfo.baseDir}/public，表示静态文件部署在项目的 public 目录中
    upload_dir: 'uploads', // 文件上传目录，例如 uploads，表示上传的文件会保存在静态文件目录下的 uploads 目录中。
  };


  config.multipart = {
    fileSize: '20mb',
    // fileExtensions: [
    //   '.docx',
    //   '.doc',
    //   '.xls',
    //   '.xlsx',
    // ],
    whitelist: filename => true, // 不做类型限制
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    verification_mode: 'jwt',
    jwt_exp: 60 * 60 * 24, // jwt过期时间(秒)
    jwt_refresh_exp: 60 * 60 * 24, // refreshToken过期时间(秒)
    socketOnlineUserRoomName: 'onlineUserRoom:', // socket所有在线用户房间名
    socketProjectRoomNamePrefix: 'roomProject:', // socket项目房间名前缀
    socketRedisExp: 30, // socket消息存入redis过期时间(秒)
    staticUseOBS: false, // 上传静态文件，使用云OBS存储
    inviteExpiresRange: 7 * 24 * 60, // 邀请有效时间（分钟）
    inviteExpiresCreateRange: 3 * 24 * 60, // 邀请有效时间更新时间，获取某个邀请时，如有效时间小于此时间，则创建一个新的邀请（分钟）
  };


  return {
    ...config,
    ...userConfig,
  };
};
