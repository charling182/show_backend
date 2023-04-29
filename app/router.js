'use strict';
module.exports = app => {
  const { router, controller } = app;
  /**
   * 公钥
   */
  router.get('/backend/configuration/public_key', controller.configuration.findRsaPublicKey);
  /**
   * 用户
   */
  router.get('/backend/user', controller.user.index);
  router.post('/backend/user/login', controller.user.login);
  router.get('/backend/user/logout', controller.user.logout);
  router.post('/backend/user/register', controller.user.register);
  router.delete('/backend/user/delete', controller.user.destroy);
  router.put('/backend/user/password', controller.user.updateUserPassword);
  router.get('/backend/user/user_info', controller.user.userInfo);

  /**
   * 验证码
   */
  router.get('/backend/verification_code', controller.verificationCode.findOne);
  router.get('/backend/verification_code/list', controller.verificationCode.findAll);
  router.post('/backend/verification_code', controller.verificationCode.create);
  router.put('/backend/verification_code', controller.verificationCode.update);
  router.delete('/backend/verification_code', controller.verificationCode.destroy);
  router.get('/backend/verification_code/verification', controller.verificationCode.verification);
};
