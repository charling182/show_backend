'use strict';

const Controller = require('egg').Controller;

/**
 * @controller 部门 department
 */
class DepartmentController extends Controller {
  /**
   * @apikey
   * @summary 获取 部门
   * @description 获取 部门
   * @request query string name department名
   * @request query string limit limit
   * @request query string offset offset
   * @router get /backend/departments/list
   */
  async findAll() {
    const { ctx, service } = this;
    const queryOrigin = {
        ...ctx.query,
    }
    ctx.query.limit ? queryOrigin.limit = parseInt(ctx.query.limit) : null;
    ctx.query.offset ? queryOrigin.offset = parseInt(ctx.query.offset) : null;
    const { allRule, query } = ctx.helper.tools.findAllParamsDeal({
      rule: ctx.rule.departmentPutBodyReq,
      queryOrigin,
    });
    ctx.validate(allRule, query);
    const res = await service.departments.findAll(query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }
  /**
   * @apikey
   * @summary 创建 部门
   * @description 创建 部门
   * @router post /backend/departments
   * @request body departmentPostBodyReq
   */
  async create() {
    const ctx = this.ctx;
    ctx.validate(ctx.rule.departmentPostBodyReq, ctx.request.body);
    await ctx.service.departments.create(ctx.request.body);
    ctx.helper.body.CREATED_UPDATE({ ctx });
  }
  /**
   * @apikey
   * @summary 更新 部门
   * @description 更新 部门
   * @router put /backend/departments
   * @request body departmentPutBodyReq
   */
  async update() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.departmentPutBodyReq, ctx.request.body);
    const res = await service.departments.update(ctx.request.body);
    res && res[0] !== 0 ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }
  /**
   * @apikey
   * @summary 获取某个 部门
   * @description 获取某个 部门
   * @router get /backend/departments
   * @request query string *id eg:1 departmentID
   */
  async findOne() {
    const { ctx, service } = this;
    ctx.query.id ? ctx.query.id = Number(ctx.query.id) : null;
    ctx.validate(ctx.rule.departmentId, ctx.query);
    const res = await service.departments.findOne(ctx.query.id);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }
  /**
   * @apikey
   * @summary 批量删除 部门
   * @description 批量删除 部门
   * @router delete /backend/departments
   * @request body departmentDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.departmentDelBodyReq, ctx.request.body);
    const res = await service.departments.destroy(ctx.request.body);
    res ? ctx.helper.body.NO_CONTENT({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }
}

module.exports = DepartmentController;
