'use strict';

const Controller = require('egg').Controller;

class UserController extends Controller {
    /**
   * @summary 获取用户列表
   * @description 获取用户列表
   * @router get /backend/user
   * @request query string search 模糊查询参数
   * @response 200 baseResponse 成功
   */
    async index() {
        const { ctx, app } = this;
        const User = app.model.User;
        const users = await User.findAll();
        ctx.body = users;
    }
}

module.exports = UserController;
