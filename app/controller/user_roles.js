'use strict';

const Controller = require('egg').Controller;

/**
 * @controller 用户-角色关系表 user_role
 */

class UserRoleController extends Controller {
  /**
   * @apikey
   * @summary 获取 用户-角色关系表
   * @description 获取 用户-角色关系表
   * @request query number user_id 用户ID
   * @request query number role_id 角色ID
   * @request query number limit limit
   * @request query number offset offset
   * @router get /backend/user_roles/list
   */
  async findAll() {
    const { ctx, service } = this;
    // get接口,格式转化为数字
    ctx.query.user_id ? ctx.query.user_id = parseInt(ctx.query.user_id) : null;
    ctx.query.role_id ? ctx.query.role_id = parseInt(ctx.query.role_id) : null;
    ctx.query.limit ? ctx.query.limit = parseInt(ctx.query.limit) : null;
    ctx.query.offset ? ctx.query.offset = parseInt(ctx.query.offset) : null;
    ctx.query.id ? ctx.query.id = parseInt(ctx.query.id) : null;

    const { allRule, query } = ctx.helper.tools.findAllParamsDeal({
        rule: ctx.rule.user_rolePutBodyReq,
        queryOrigin: ctx.query,
    });
    ctx.validate(allRule, query);
    const res = await service.userRoles.findAll(query);
    ctx.helper.body.SUCCESS({ ctx, res });
    }

  /**
   * @apikey
   * @summary 批量删除 用户-角色关系表
   * @description 批量删除 用户-角色关系表
   * @router delete /backend/user_roles
   * @request body user_roleDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.user_roleDelBodyReq, ctx.request.body);
    const res = await service.userRoles.destroy(ctx.request.body);
    res ? ctx.helper.body.NO_CONTENT({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 创建 单用户-多角色关系
   * @description 创建 单用户-多角色关系
   * @router post /backend/user_roles/bulk_role
   * @request body user_roleBodyReq
   */
  async bulkCreateRole() {
    const ctx = this.ctx;
    const params = {
      user_id: ctx.rule.user_roleBodyReq.user_id,
      role_ids: {
        type: 'array',
        itemType: 'number',
        rule: {
          min: 1,
        },
        min: 1,
      },
    };
    ctx.validate(params, ctx.request.body);
    await ctx.service.userRoles.bulkCreateRole(ctx.request.body);
    ctx.helper.body.CREATED_UPDATE({ ctx });
  }
}

module.exports = UserRoleController;
