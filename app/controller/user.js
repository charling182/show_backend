'use strict';

const Controller = require('egg').Controller;
const NodeRSA = require('node-rsa');


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
  /**
   * @summary 登录
   * @description 登录
   * @router post /backend/user/login
   * @request body loginPostBodyReq
   */
  async login() {
    const { ctx, service, app } = this;
    const beforeParams = {
      username: ctx.rule.userBodyReq.username,
      password: {
        type: 'string',
        required: true,
        trim: true,
      },
    };
    const params = {
      username: ctx.rule.userBodyReq.username,
      password: ctx.rule.userBodyReq.password,
    };
    ctx.validate(beforeParams, ctx.request.body);

    try {
      const { rsa_private_key } = await ctx.model.Configuration.findOne({
        where: { id: 1 },
      });
      const key = new NodeRSA(rsa_private_key);
      ctx.request.body.password = key.decrypt(ctx.request.body.password, 'utf8');
    } catch (e) {
      ctx.helper.body.UNAUTHORIZED({ ctx });
    }
    ctx.validate(params, ctx.request.body);
    const res = await service.user.login(ctx.request.body);
    switch (res.__code_wrong) {
      case undefined:
        ctx.helper.body.SUCCESS({ ctx, res });
        break;
      case 40000:
        ctx.helper.body.INVALID_REQUEST({ ctx, code: 40000, msg: '密码错误' });
        break;
      case 40004:
        ctx.helper.body.INVALID_REQUEST({
          ctx,
          code: 40004,
          msg: '用户不存在',
        });
        break;
      case 40005:
        ctx.helper.body.INVALID_REQUEST({
          ctx,
          code: 40005,
          msg: '账号已停用',
        });
        break;
      default:
        ctx.helper.body.UNAUTHORIZED({ ctx });
        break;
    }
  }
  /**
   * @summary 登出
   * @description 登出
   * @router get /backend/user/logout
   */
  async logout() {
    const { ctx, service } = this;
    await service.user.logout();
    ctx.helper.body.SUCCESS({ ctx });
  }
  /**
   * @summary 注册用户
   * @description 注册用户
   * @router post /backend/user/register
   * @request body registerPostBodyReq
   */
  async register() {
    const { ctx } = this;
    ctx.validate(ctx.rule.registerPostBodyReq, ctx.request.body);
    // 二次密码校验
    if (ctx.request.body.password !== ctx.request.body.confirm_password) {
      ctx.helper.body.INVALID_REQUEST({ ctx, code: 40000, msg: '两次密码不一致' });
    }
    // 删除body中的confirm_password
    delete ctx.request.body.confirm_password;
    // 解密密码
    const { rsa_private_key } = await ctx.model.Configuration.findOne({
      where: { id: 1 },
    });
    const key = new NodeRSA(rsa_private_key);
    ctx.request.body.password = key.decrypt(ctx.request.body.password, 'utf8');
    // 调用service
    const res = await ctx.service.user.create(ctx.request.body);
    if (!res.__code_wrong) {
      ctx.helper.body.CREATED_UPDATE({ ctx });
    } else {
      ctx.helper.body.INVALID_REQUEST({ ctx, code: res.__code_wrong, msg: res.message });
    }
  }

  /**
   * @apikey
   * @summary 批量删除 用户
   * @description 批量删除 用户
   * @router delete /backend/user/delete
   * @request body userDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.userDelBodyReq, ctx.request.body);
    const res = await service.user.destroy(ctx.request.body);
    res ? ctx.helper.body.NO_CONTENT({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @summary 修改 用户密码
   * @description 修改 用户密码
   * @router put /backend/user/password
   * @request body userUpdatePasswordBodyReq
   */
  async updateUserPassword() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.userUpdatePasswordBodyReq, ctx.request.body);
    // 二次密码校验
    if (ctx.request.body.password !== ctx.request.body.confirm_password) {
      ctx.helper.body.INVALID_REQUEST({ ctx, code: 40000, msg: '两次密码不一致' });
    }
    // 删除body中的confirm_password
    delete ctx.request.body.confirm_password;
    // 解密密码
    const { rsa_private_key } = await ctx.model.Configuration.findOne({
      where: { id: 1 },
    });
    const key = new NodeRSA(rsa_private_key);
    ctx.request.body.password = key.decrypt(ctx.request.body.password, 'utf8');
    const res = await service.user.updateUserPassword(ctx.request.body);
    if (!res.__code_wrong) {
      ctx.helper.body.SUCCESS({ ctx });
    } else {
      ctx.helper.body.INVALID_REQUEST({ ctx, code: res.__code_wrong, msg: res.message });
    }
  }

  /**
   * @apikey
   * @summary 获取 用户信息
   * @description 获取 用户信息
   * @router get /backend/user/user_info
   */
  async userInfo() {
    const { ctx, service } = this;
    const res = await service.user.userInfo();
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

}

module.exports = UserController;
