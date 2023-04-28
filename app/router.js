'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/backend/user', controller.user.index);
  router.get('/backend/user/login', controller.user.login);
  router.get('/backend/configuration/public_key', controller.configuration.findRsaPublicKey);
};
