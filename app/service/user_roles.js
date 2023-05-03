'use strict';

const Service = require('egg').Service;

/**
 * @Service 用户-角色关系表 user_role
 */

class UserRoleService extends Service {

    async findAll(payload) {
        const { ctx } = this;
        const { limit, offset, prop_order, order } = payload;
        const where = payload.where;
        const Order = [];
        prop_order && order ? Order.push([prop_order, order]) : null;
        return await ctx.model.UserRoles.findAndCountAll({
          limit,
          offset,
          where,
          order: Order,
          include: [
            {
              model: ctx.model.Roles,
              attributes: {
                exclude: ['created_at', 'updated_at'],
              },
              where: {
                // name: { [ Op.like ]: '%stri%' },
              },
            },
          ],
        });
    }

    async destroy(payload) {
        const { ctx } = this;
        const delData = await ctx.model.UserRoles.findAll({
          where: { id: payload.ids },
        });
        return await ctx.model.UserRoles.destroy({
          where: { id: payload.ids },
          delData,
        });
      }

  /**
   *  单用户批量添加多角色
   * @param payload
   * @return {Promise<void>}
   */
  async bulkCreateRole(payload) {
    const { ctx } = this;
    payload = payload.role_ids.map(e => {
      return { user_id: payload.user_id, role_id: e };
    });
    return await ctx.model.UserRoles.bulkCreate(payload);
  }

}

module.exports = UserRoleService;