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
   * @request body userBodyReq
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

    const { rsa_private_key } = await ctx.model.Configuration.findOne({
      where: { id: 1 },
    });
    const key = new NodeRSA(rsa_private_key);
    ctx.request.body.password = key.decrypt(ctx.request.body.password, 'utf8');
    // 如果不是开发环境 获取配置中的rsa私钥对密码解密
    const code = Math.random()
      .toString()
      .substring(2, 8);
    app.mailer.send({
      from: '"Charling" <1650070770@qq.com>', // sender address, [options] default to user
      // // Array => ['bar@example.com', 'baz@example.com']
      to: [ '18515481949@163.com' ], // list of receivers
      subject: 'Charling验证码邮件', // Subject line
      text: code, // plain text body
      html: `<div style="display: flex;flex-direction: column;justify-content: center;align-items: center;
                  width: 300px;height: 300px;box-shadow: 0px 0px 10px #ccc;border-radius: 30px;margin: 66px auto;">
                <img width="100" src="/public/image/charling.png" alt="">
                <span style="line-height: 36px;">来自 Charling 的邮箱验证码：</span>
                <div style="font-weight: 600;font-size: 22px;line-height: 46px;">${code}</div>
              </div>`, // html body
    });
    ctx.validate(params, ctx.request.body);
    console.log('查看密码---------', ctx.request.body);
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
}

module.exports = UserController;
