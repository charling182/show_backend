'use strict';

const Controller = require('egg').Controller;

/**
 * @controller 角色 roles
 */

class RolesController extends Controller {

  /**
* @apikey
* @summary 获取role
* @description 获取role
* @request query string name role名
* @request query number limit limit
* @request query number offset offset
* @router get /backend/list
*/
  async index() {
    const { ctx, service } = this;
    // get接口,字符串转数字
    ctx.query.limit ? ctx.query.limit = parseInt(ctx.query.limit) : '';
    ctx.query.offset ? ctx.query.offset = parseInt(ctx.query.offset) : '';
    ctx.query.id ? ctx.query.id = parseInt(ctx.query.id) : '';
    const { allRule, query } = ctx.helper.tools.findAllParamsDeal({
      rule: ctx.rule.roleBodyReq,
      queryOrigin: ctx.query,
    });
    ctx.validate(allRule, query);
    const res = await service.roles.index(query);
    ctx.helper.body.SUCCESS({ ctx, res });
  }

  /**
   * @apikey
   * @summary 创建role
   * @description 创建role
   * @router post /api/v1/roles
   * @request body rolePostBodyReq
   */
  async create() {
    const ctx = this.ctx;
    ctx.validate(ctx.rule.rolePostBodyReq, ctx.request.body);
    await ctx.service.roles.create(ctx.request.body);
    ctx.helper.body.CREATED_UPDATE({ ctx });
  }

  /**
   * @apikey
   * @summary 批量删除role
   * @description 批量删除role
   * @router delete /backend/roles
   * @request body roleDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.roleDelBodyReq, ctx.request.body);
    const res = await service.roles.destroy(ctx.request.body);
    if (res.__code_wrong) {
      switch (res.__code_wrong) {
        case 40000:
          ctx.helper.body.INVALID_REQUEST({
            ctx,
            code: res.__code_wrong,
            msg: '不可删除默认角色',
          });
          break;
        case 40001:
          ctx.helper.body.INVALID_REQUEST({
            ctx,
            code: res.__code_wrong,
            msg: '角色已经被分配给用户使用，解除绑定关系后删除',
          });
          break;
        default:
          ctx.helper.body.INVALID_REQUEST({ ctx });
          break;
      }
      return;
    }
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 更新role
   * @description 更新role
   * @router put /backend/roles
   * @request body rolePutBodyReq
   */
  async update() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.rolePutBodyReq, ctx.request.body);
    const res = await service.roles.update(ctx.request.body);
    res && res[0] !== 0 ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 获取某个role
   * @description 获取某个role
   * @router get /backend/roles
   * @request query number *id eg:1 roleID
   */
  async show() {
    const { ctx, service } = this;
    // get接口,字符串转数字
    ctx.query.id ? ctx.query.id = parseInt(ctx.query.id) : '';
    ctx.validate(ctx.rule.roleId, ctx.query);
    const res = await service.roles.show(ctx.query.id);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 更新是否为默认角色
   * @description 更新是否为默认角色
   * @router update /backend/roles/is_default
   * @request body roleId
   */
  async updateIsDefault() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.roleId, ctx.request.body);
    const res = await service.roles.updateIsDefault(ctx.request.body);
    res ? ctx.helper.body.SUCCESS({ ctx }) : ctx.helper.body.INVALID_REQUEST({ ctx });
  }
}

module.exports = RolesController;

