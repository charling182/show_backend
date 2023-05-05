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

  /**
   * 资源
   */
  router.post('/backend/permissions', controller.permissions.create);
  router.put('/backend/permissions', controller.permissions.update);
  router.get('/backend/permissions/list', controller.permissions.findAll);
  router.get('/backend/permissions', controller.permissions.findOne);
  router.delete('/backend/permissions', controller.permissions.destroy);

  /**
   * 角色-资源关系表
   */
  router.post('/backend/role_permissions', controller.rolePermissions.create);
  router.put('/backend/role_permissions', controller.rolePermissions.update);
  router.get('/backend/role_permissions/list', controller.rolePermissions.findAll);
  router.get('/backend/role_permissions', controller.rolePermissions.findOne);
  router.delete('/backend/role_permissions', controller.rolePermissions.destroy);
  router.post('/backend/role_permissions/bulk_permission', controller.rolePermissions.bulkCreatePremission);

  /**
   * 角色-菜单关系表
   */
  router.post('/backend/role_menus', controller.roleMenus.create);
  router.put('/backend/role_menus', controller.roleMenus.update);
  router.get('/backend/role_menus/list', controller.roleMenus.findAll);
  router.get('/backend/role_menus', controller.roleMenus.findOne);
  router.delete('/backend/role_menus', controller.roleMenus.destroy);
  router.post('/backend/role_menus/bulk_menu', controller.roleMenus.bulkCreateMenu);

  /**
   * 菜单
   */
  router.post('/backend/menus', controller.menus.create);
  router.put('/backend/menus', controller.menus.update);
  router.get('/backend/menus/list', controller.menus.findAll);
  router.get('/backend/menus', controller.menus.findOne);
  router.delete('/backend/menus', controller.menus.destroy);
  router.get('/backend/menus/user_menus', controller.menus.userMenus);
};
