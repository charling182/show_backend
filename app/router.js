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
  // router.get('/backend/user', controller.user.index);
  router.post('/backend/user/login', controller.user.login);
  router.get('/backend/user/logout', controller.user.logout);
  router.post('/backend/user/register', controller.user.register);
  router.delete('/backend/user/delete', controller.user.destroy);
  router.put('/backend/user/password', controller.user.updateUserPassword);
  router.get('/backend/user/user_info', controller.user.userInfo);
  router.put('/backend/user', controller.user.update);
  router.get('/backend/user/list', controller.user.findAll);
  router.put('/backend/user/department', controller.user.updateUserDepartment);
  router.get('/backend/user', controller.user.findOne);

  /**
   * 验证码
   */
  router.get('/backend/verification_code', controller.verificationCode.findOne);
  router.get('/backend/verification_code/list', controller.verificationCode.findAll);
  router.post('/backend/verification_code', controller.verificationCode.create);
  router.put('/backend/verification_code', controller.verificationCode.update);
  router.delete('/backend/verification_code', controller.verificationCode.destroy);
  router.get('/backend/verification_code/verification', controller.verificationCode.verification);

  /**
   * 部门
   */
  router.post('/backend/departments', controller.departments.create);
  router.put('/backend/departments', controller.departments.update);
  router.get('/backend/departments/list', controller.departments.findAll);
  router.get('/backend/departments', controller.departments.findOne);
  router.delete('/backend/departments', controller.departments.destroy);

    /**
   * 角色
   */
    router.post('/backend/roles', controller.roles.create);
    router.put('/backend/roles', controller.roles.update);
    router.get('/backend/roles/list', controller.roles.index);
    router.get('/backend/roles', controller.roles.show);
    router.delete('/backend/roles', controller.roles.destroy);
    router.put('/backend/roles/is_default', controller.roles.updateIsDefault);
  
    /**
     * 用户角色关系表
     */
    router.get('/backend/user_roles/list', controller.userRoles.findAll);
    router.delete('/backend/user_roles', controller.userRoles.destroy);
    router.post('/backend/user_roles/bulk_role', controller.userRoles.bulkCreateRole);
};
