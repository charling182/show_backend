'use strict';

const Controller = require('egg').Controller;

/**
 * @controller 验证码 verification_code
 */
class RoleController extends Controller {
  /**
   * @summary 获取某个 验证码
   * @description 获取某个 验证码
   * @router get /backend/verification_code
   * @request query number *id eg:1 verification_codeID
   */
  async findOne() {
    const { ctx, service } = this;
    ctx.query.id = Number(ctx.query.id);
    console.log('ctx.query.id', ctx.query.id);
    ctx.validate(ctx.rule.verification_codeId, ctx.query);
    const res = await service.verificationCode.findOne(ctx.query.id);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @summary 获取 验证码
   * @description 获取 验证码
   * @request query string name verification_code名
   * @request query number limit limit
   * @request query number offset offset
   * @router get /backend/verification_code/list
   */
  async findAll() {
    const { ctx, service } = this;
    ctx.query.limit ? ctx.query.limit = Number(ctx.query.limit) : null;
    ctx.query.offset ? ctx.query.offset = Number(ctx.query.offset) : null;
    const { allRule, query } = ctx.helper.tools.findAllParamsDeal({
      rule: ctx.rule.verification_codePutBodyReq,
      queryOrigin: ctx.query,
    });
    ctx.validate(allRule, query);
    const res = await service.verificationCode.findAll(query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }

  /**
   * @apikey
   * @summary 创建 验证码
   * @description 创建 验证码
   * @router post /backend/verification_code
   * @request body verification_codeBodyReq
   */
  async create() {
    const ctx = this.ctx;
    ctx.validate(ctx.rule.verification_codeBodyReq, ctx.request.body);
    await ctx.service.verificationCode.create(ctx.request.body);
    ctx.helper.body.CREATED_UPDATE({ ctx });
  }

  /**
   * @apikey
   * @summary 更新 验证码
   * @description 更新 验证码
   * @router put /backend/verification_codes
   * @request body verification_codePutBodyReq
   */
  async update() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.verification_codePutBodyReq, ctx.request.body);
    const res = await service.verificationCode.update(ctx.request.body);
    res && res[0] !== 0 ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 批量删除 验证码
   * @description 批量删除 验证码
   * @router delete /backend/verification_code
   * @request body verification_codeDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.verification_codeDelBodyReq, ctx.request.body);
    const res = await service.verificationCode.destroy(ctx.request.body);
    res ? ctx.helper.body.NO_CONTENT({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 获取 验证此验证码
   * @description 获取 验证此验证码
   * @router get /backend/verification_code/verification
   * @request query string *target eg:1@qq.com 验证对象
   * @request query string *code eg:1111 验证码
   */
  async verification() {
    const { ctx, service } = this;
    const params = {
      code: {
        ...ctx.rule.verification_codeBodyReq.code,
      },
      target: {
        ...ctx.rule.verification_codeBodyReq.target,
      },
    };
    ctx.validate(params, ctx.query);
    const res = await service.verificationCode.verification(ctx.query);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }
}

module.exports = RoleController;
