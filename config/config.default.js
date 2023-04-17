'use strict';

module.exports = appInfo => {
    const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_{{keys}}';

  // add your config here
    config.middleware = [];

    config.swaggerdoc = {
        dirScanner: './app/controller',
        apiInfo: {
            title: 'Example API',
            description: 'Example API for egg-swagger-doc',
            version: '1.0.0',
        },
        schemes: [ 'http' ],
        consumes: [ 'application/json' ],
        produces: [ 'application/json' ],
        enableSecurity: false,
        routerMap: true,
        enable: true,
    }

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
