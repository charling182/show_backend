'use strict';

const Controller = require('egg').Controller;

/**
 * @controller 资源 permission
 */

class RoleController extends Controller {
  /**
   * @apikey
   * @summary 获取 资源
   * @description 获取 资源
   * @request query string keyword 资源名/标识码/标识码名/路径/动作
   * @request query string name permission名
   * @request query string mark 标识码
   * @request query string mark_name 标识码名
   * @request query string url 路径
   * @request query string action 动作
   * @request query number limit limit
   * @request query number offset offset
   * @router get /backend/permissions/list
   */
  async findAll() {
    const { ctx, service } = this;
    // get请求参数转为数字类型
    ctx.helper.tools.queryParseInt(ctx.query, ['limit', 'offset']);
    const { allRule, query } = ctx.helper.tools.findAllParamsDeal({
      rule: ctx.rule.permissionPutBodyReq,
      queryOrigin: ctx.query,
    });
    ctx.validate(allRule, query);
    const res = await service.permissions.findAll(query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }

  /**
   * @apikey
   * @summary 获取某个 资源
   * @description 获取某个 资源
   * @router get /backend/permissions
   * @request query number *id eg:1 permissionID
   */
  async findOne() {
    const { ctx, service } = this;
    ctx.helper.tools.queryParseInt(ctx.query, ['id']);
    ctx.validate(ctx.rule.permissionId, ctx.query);
    const res = await service.permissions.findOne(ctx.query.id);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 创建 资源
   * @description 创建 资源
   * @router post /backend/permissions
   * @request body permissionBodyReq
   */
  async create() {
    const ctx = this.ctx;
    ctx.validate(ctx.rule.permissionBodyReq, ctx.request.body);
    await ctx.service.permissions.create(ctx.request.body);
    ctx.helper.body.CREATED_UPDATE({ ctx });
  }

  /**
   * @apikey
   * @summary 更新 资源
   * @description 更新 资源
   * @router put /backend/permissions
   * @request body permissionPutBodyReq
   */
  async update() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.permissionPutBodyReq, ctx.request.body);
    const res = await service.permissions.update(ctx.request.body);
    res && res[0] !== 0 ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 批量删除 资源
   * @description 批量删除 资源
   * @router delete /backend/permissions
   * @request body permissionDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.permissionDelBodyReq, ctx.request.body);
    // service.permissions.destroy(ctx.request.body) 抛出一个错误（例如，由于数据库的 onDelete: 'NO ACTION' 约束），那么这个错误将会中断函数的执行，
    try {
      // try 和 catch 块有各自的作用域。在 try 块中声明的变量在 catch 块中是不可见的，反之亦然。这就是为什么你不能在 catch 块中访问 try 块中定义的 res 变量。
      // 错误处理中间件未能捕获到错误，所以需要在这里捕获错误
      const res = await service.permissions.destroy(ctx.request.body);
      // 如果有角色关联了该资源，则不允许删除
      if (res && res.role_relation_permission) {
        ctx.helper.body.PERMISSIONS_NOT_DELETE({ ctx });
      } else {
        res ? ctx.helper.body.NO_CONTENT({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
      }
    } catch (error) {
      // Handle the error here
      ctx.helper.body.PERMISSIONS_NOT_DELETE({ ctx })
    }
  }
}

module.exports = RoleController;
