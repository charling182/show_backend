'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

class PermissionService extends Service {
  async findAll(payload) {
    const { ctx } = this;
    const { limit, offset, prop_order = 'created_at', order = 'DESC' } = payload;
    const where = payload.where;
    const Order = [];
    prop_order && order ? Order.push([prop_order, order]) : null;
    return await ctx.model.Permissions.findAndCountAll({
      limit,
      offset,
      where,
      order: Order,
    });
  }

  async findOne(id) {
    const { ctx } = this;
    return await ctx.model.Permissions.findOne({ where: { id } });
  }

  async create(payload) {
    const { ctx } = this;
    const { url, action } = payload;
    const one = await ctx.model.Permissions.findOne({ where: { url, action } });
    if (one) {
      const err = new Error('已存在');
      err.parent = {};
      err.parent.errno = 1062;
      throw err;
    }
    return await ctx.model.Permissions.create(payload);
  }

  async update(payload) {
    const { ctx } = this;
    const { id, url, action } = payload;
    const one = await ctx.model.Permissions.findOne({
      where: { id: { [Op.not]: id }, url, action },
    });
    if (one) {
      const err = new Error('已存在');
      err.parent = {};
      err.parent.errno = 1062;
      throw err;
    }
    return await ctx.model.Permissions.update(payload, {
      ctx,
      where: { id: payload.id },
    });
  }

  async destroy(payload) {
    const { ctx } = this;
    const delData = await ctx.model.Permissions.findAll({
      where: { id: payload.ids },
    });
    const relatedData = await ctx.model.RolePermissions.findAndCountAll(
      {
        where: { permission_id: payload.ids },
      }
    );
    // 在删除资源时，如果有角色关联了该资源，则不允许删除
    if (relatedData.count > 0) {
      return {
        role_relation_permission: true
      }
    }
    return await ctx.model.Permissions.destroy({
      ctx,
      where: { id: payload.ids },
      delData,
    });
  }
}

module.exports = PermissionService;
