'use strict';

const Controller = require('egg').Controller;

/**
 * @controller 操作日志 operation_log
 */

class RoleController extends Controller {
  /**
   * @apikey
   * @summary 获取 操作日志
   * @description 获取 操作日志
   * @request query string name operation_log名
   * @request query number limit limit
   * @request query number offset offset
   * @router get /backend/operation_logs/list
   */
  async findAll() {
    const { ctx, service } = this;
    // get接口参数类型转化为数字
    ctx.helper.tools.queryParseInt(ctx.query, ['limit', 'offset']);
    const { allRule, query } = ctx.helper.tools.findAllParamsDeal({
      rule: ctx.rule.operation_logPutBodyReq,
      queryOrigin: ctx.query,
      keywordLikeExcludeParams: ['params'],
    });
    ctx.validate(allRule, query);
    const res = await service.operationLogs.findAll(query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }

  /**
   * @apikey
   * @summary 获取某个 操作日志
   * @description 获取某个 操作日志
   * @router get /backend/operation_logs
   * @request query number *id eg:1 operation_logID
   */
  async findOne() {
    const { ctx, service } = this;
    ctx.helper.tools.queryParseInt(ctx.query, ['id']);
    ctx.validate(ctx.rule.operation_logId, ctx.query);
    const res = await service.operationLogs.findOne(ctx.query.id);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 创建 操作日志
   * @description 创建 操作日志
   * @router post /backend/operation_logs
   * @request body operation_logBodyReq
   */
  async create() {
    const ctx = this.ctx;
    ctx.validate(ctx.rule.operation_logBodyReq, ctx.request.body);
    await ctx.service.operationLogs.create(ctx.request.body);
    ctx.helper.body.CREATED_UPDATE({ ctx });
  }

  /**
   * @apikey
   * @summary 更新 操作日志
   * @description 更新 操作日志
   * @router put /backend/operation_logs
   * @request body operation_logPutBodyReq
   */
  async update() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.operation_logPutBodyReq, ctx.request.body);
    const res = await service.operationLogs.update(ctx.request.body);
    res && res[0] !== 0 ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 批量删除 操作日志
   * @description 批量删除 操作日志
   * @router delete /backend/operation_logs
   * @request body operation_logDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.operation_logDelBodyReq, ctx.request.body);
    const res = await service.operationLogs.destroy(ctx.request.body);
    res ? ctx.helper.body.NO_CONTENT({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }
}

module.exports = RoleController;
