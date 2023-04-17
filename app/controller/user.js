'use strict';

const Controller = require('egg').Controller;

/**
 * @controller 用户 user
 */
class UserController extends Controller {
  /**
   * @summary 获取用户列表
   * @description 获取用户列表
   * @router get /backend/user
   */
  async index() {
    const { ctx, app } = this;
    const User = app.model.User;
    const res = await User.findAll();
    ctx.helper.body.SUCCESS({ ctx, res });
    // ctx.body = users;
  }
}

module.exports = UserController;
