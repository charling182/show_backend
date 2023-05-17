'use strict';
module.exports = app => {
  const { router, controller, io } = app;

  /**
   * webSocket
   */
  const nsp = io.of('/');
  nsp.route('server', io.controller.index.ping);
  nsp.route('ack', io.controller.index.ack);

  /**
   * 资源上传
   */
  router.post('/backend/uploads', controller.uploads.create);

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

  /**
   * 项目
   */
  router.post('/backend/projects', controller.projects.create);
  router.put('/backend/projects', controller.projects.update);
  router.get('/backend/projects/list', controller.projects.findAll);
  router.get('/backend/projects', controller.projects.findOne);
  router.delete('/backend/projects', controller.projects.destroy);
  router.get('/backend/projects/statistics', controller.projects.projectStatistics);

  /**
   * 任务
   */
  router.post('/backend/tasks', controller.tasks.create);
  router.put('/backend/tasks', controller.tasks.update);
  router.get('/backend/tasks/list', controller.tasks.findAll);
  router.get('/backend/tasks', controller.tasks.findOne);
  router.delete('/backend/tasks', controller.tasks.destroy);
  router.put('/backend/tasks/sort', controller.tasks.sort);
  router.put('/backend/tasks/recycle_all_task_of_taskList', controller.tasks.recycleAllTaskOfTaskList);

  /**
   * 项目模板
   */
  router.post('/backend/project_templates', controller.projectTemplates.create);
  router.put('/backend/project_templates', controller.projectTemplates.update);
  router.get('/backend/project_templates/list', controller.projectTemplates.findAll);
  router.get('/backend/project_templates', controller.projectTemplates.findOne);
  router.delete('/backend/project_templates', controller.projectTemplates.destroy);

  /**
   * 项目模板任务
   */
  router.post('/backend/project_template_tasks', controller.projectTemplateTasks.create);
  router.put('/backend/project_template_tasks', controller.projectTemplateTasks.update);
  router.get('/backend/project_template_tasks/list', controller.projectTemplateTasks.findAll);
  router.get('/backend/project_template_tasks', controller.projectTemplateTasks.findOne);
  router.delete('/backend/project_template_tasks', controller.projectTemplateTasks.destroy);

  /**
   * 任务列表
   */
  router.post('/backend/task_lists', controller.taskLists.create);
  router.put('/backend/task_lists', controller.taskLists.update);
  router.get('/backend/task_lists/list', controller.taskLists.findAll);
  router.get('/backend/task_lists', controller.taskLists.findOne);
  router.delete('/backend/task_lists', controller.taskLists.destroy);
  router.put('/backend/task_lists/sort', controller.taskLists.sort);

  /**
   * 用户-项目关系
   */
  router.post('/backend/user_projects', controller.userProjects.create);
  router.put('/backend/user_projects', controller.userProjects.update);
  router.get('/backend/user_projects/list', controller.userProjects.findAll);
  router.get('/backend/user_projects', controller.userProjects.findOne);
  router.delete('/backend/user_projects', controller.userProjects.destroy);
  router.delete('/backend/user_projects/quit', controller.userProjects.quit);

  /**
   * 用户-项目-收藏关系表
   */
  router.post('/backend/user_project_collects/change', controller.userProjectCollects.change);

  /**
   * 站内信
   */
  router.post('/backend/messages', controller.messages.create);
  router.put('/backend/messages', controller.messages.update);
  router.get('/backend/messages/list', controller.messages.findAll);
  router.get('/backend/messages', controller.messages.findOne);
  router.delete('/backend/messages', controller.messages.destroy);

  /**
   * 邀请
   */
  router.post('/backend/invites', controller.invites.create);
  router.put('/backend/invites', controller.invites.update);
  router.get('/backend/invites/list', controller.invites.findAll);
  router.get('/backend/invites', controller.invites.findOne);
  router.delete('/backend/invites', controller.invites.destroy);
  router.get('/backend/invites/valid', controller.invites.findValidOne);
  router.get('/backend/invites/uuid', controller.invites.findOneByUUID);
  router.put('/backend/invites/accept', controller.invites.acceptInvite);

  /**
   * 操作日志
   */
  router.post('/backend/operation_logs', controller.operationLogs.create);
  router.put('/backend/operation_logs', controller.operationLogs.update);
  router.get('/backend/operation_logs/list', controller.operationLogs.findAll);
  router.get('/backend/operation_logs', controller.operationLogs.findOne);
  router.delete('/backend/operation_logs', controller.operationLogs.destroy);

  /**
   * 项目文件
   */
  router.post('/backend/project_files', controller.projectFiles.create);
  router.put('/backend/project_files', controller.projectFiles.update);
  router.get('/backend/project_files/list', controller.projectFiles.findAll);
  router.get('/backend/project_files', controller.projectFiles.findOne);
  router.delete('/backend/project_files', controller.projectFiles.destroy);

  /**
   * 任务日志
   */
  router.post('/backend/task_logs', controller.taskLogs.create);
  router.put('/backend/task_logs', controller.taskLogs.update);
  router.get('/backend/task_logs/list', controller.taskLogs.findAll);
  router.delete('/backend/task_logs', controller.taskLogs.destroy);

  /**
   * 任务优先级
   */
  router.post('/backend/task_prioritys', controller.taskPrioritys.create);
  router.put('/backend/task_prioritys', controller.taskPrioritys.update);
  router.get('/backend/task_prioritys/list', controller.taskPrioritys.findAll);
  router.get('/backend/task_prioritys', controller.taskPrioritys.findOne);
  router.delete('/backend/task_prioritys', controller.taskPrioritys.destroy);

  /**
   * 任务状态
   */
  router.post('/backend/task_states', controller.taskStates.create);
  router.put('/backend/task_states', controller.taskStates.update);
  router.get('/backend/task_states/list', controller.taskStates.findAll);
  router.get('/backend/task_states', controller.taskStates.findOne);
  router.delete('/backend/task_states', controller.taskStates.destroy);

  /**
   * 任务标签
   */
  router.post('/backend/task_tags', controller.taskTags.create);
  router.put('/backend/task_tags', controller.taskTags.update);
  router.get('/backend/task_tags/list', controller.taskTags.findAll);
  router.get('/backend/task_tags', controller.taskTags.findOne);
  router.delete('/backend/task_tags', controller.taskTags.destroy);

  /**
   * 任务-任务标签关系表
   */
  router.post('/backend/task_task_tags', controller.taskTaskTags.create);
  router.put('/backend/task_task_tags', controller.taskTaskTags.update);
  router.get('/backend/task_task_tags/list', controller.taskTaskTags.findAll);
  router.get('/backend/task_task_tags', controller.taskTaskTags.findOne);
  router.delete('/backend/task_task_tags', controller.taskTaskTags.destroy);
  router.post('/backend/task_task_tags/change', controller.taskTaskTags.change);

  /**
   * 任务类型
   */
  router.post('/backend/task_types', controller.taskTypes.create);
  router.put('/backend/task_types', controller.taskTypes.update);
  router.get('/backend/task_types/list', controller.taskTypes.findAll);
  router.get('/backend/task_types', controller.taskTypes.findOne);
  router.delete('/backend/task_types', controller.taskTypes.destroy);

  /**
   * 任务工时
   */
  router.post('/backend/task_working_hours', controller.taskWorkingHours.create);
  router.put('/backend/task_working_hours', controller.taskWorkingHours.update);
  router.get('/backend/task_working_hours/list', controller.taskWorkingHours.findAll);
  router.delete('/backend/task_working_hours', controller.taskWorkingHours.destroy);

  /**
   * 用户-任务-点赞关系表
   */
  router.post('/backend/user_task_likes/change', controller.userTaskLikes.change);

  /**
 * 用户-任务标签关系表
 */
  router.post('/backend/user_tasks/change', controller.userTasks.change);
};
