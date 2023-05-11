'use strict';

const Controller = require('egg').Controller;
const NodeRSA = require('node-rsa');


/**
 * @controller 用户 user
 */
class UserController extends Controller {
  /**
   * @summary 测试接口
   * @description 测试接口
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

  /**
   * @apikey
   * @summary 更新 用户
   * @description 更新 用户
   * @router put /backend/user
   * @request body userPutBodyReq
   */
  async update() {
    // try {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.userPutBodyReq, ctx.request.body);
    const res = await service.user.update(ctx.request.body);
    res && res[0] !== 0 ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });

    // } catch (e) {
    //   console.log('e---------', e.name, e.errors);
    // }
  }
  /**
   * @apikey
   * @summary 获取 用户
   * @description 获取 用户
   * @request query string keyword 用户名/邮箱/手机
   * @request query string username 用户名
   * @request query string email 邮箱
   * @request query string phone 手机
   * @request query number state 状态
   * @request query number department_id 部门ID
   * @request query number limit limit
   * @request query number offset offset
   * @router get /backend/user/list
   */
  async findAll() {
    const { ctx, service } = this;
    const params = {
      keyword: {
        type: 'string',
        trim: true,
        required: false,
        max: 50,
      },
      username: {
        ...ctx.rule.userBodyReq.username,
        required: false,
        min: 1,
      },
      email: {
        ...ctx.rule.userBodyReq.email,
        required: false,
        format: /.*/,
      },
      phone: {
        ...ctx.rule.userBodyReq.phone,
        required: false,
        min: 1,
      },
      state: {
        ...ctx.rule.userBodyReq.state,
        required: false,
      },
      department_id: {
        ...ctx.rule.userBodyReq.department_id,
        required: false,
      },
      date_after_created: {
        type: 'dateTime',
        required: false,
      },
      project_id: {
        type: 'number',
        required: false,
      },
      prop_order: {
        type: 'enum',
        required: false,
        values: [...Object.keys(ctx.rule.userPutBodyReq), ''],
      },
      order: {
        type: 'enum',
        required: false,
        values: ['desc', 'asc', ''],
      },
      limit: {
        type: 'number',
        required: false,
        default: 10,
        max: 1000,
      },
      offset: {
        type: 'number',
        required: false,
        default: 0,
      },
    };
    ctx.query.department_id ? ctx.query.department_id = Number(ctx.query.department_id) : '';
    ctx.query.project_id ? ctx.query.project_id = Number(ctx.query.project_id) : '';
    ctx.query.state ? ctx.query.state = Number(ctx.query.state) : '';
    ctx.query.limit ? ctx.query.limit = Number(ctx.query.limit) : '';
    ctx.query.offset ? ctx.query.offset = Number(ctx.query.offset) : '';

    ctx.validate(params, ctx.query);
    const res = await service.user.findAll(ctx.query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }

  /**
   * @apikey
   * @summary 修改 用户所属部门
   * @description 修改 用户所属部门
   * @router put /backend/user/department
   * @request body updateUserDepartmentBodyReq
   */
  async updateUserDepartment() {
    const { ctx, service } = this;
    const params = {
      id: {
        ...ctx.rule.userPutBodyReq.id,
      },
      department_id: {
        ...ctx.rule.userPutBodyReq.department_id,
        required: true,
      },
    };
    ctx.validate(params, ctx.request.body);
    const res = await service.user.updateUserDepartment(ctx.request.body);
    res && res[0] !== 0 ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.INVALID_REQUEST({ ctx });
  }

  /**
   * @apikey
   * @summary 获取某个 用户
   * @description 获取某个 用户
   * @router get /backend/user
   * @request query number *id eg:1 userID
   */
  async findOne() {
    const { ctx, service } = this;
    ctx.query.id = parseInt(ctx.query.id);
    ctx.validate(ctx.rule.userId, ctx.query);
    const res = await service.user.findOne(ctx.query.id);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }
}

module.exports = UserController;
