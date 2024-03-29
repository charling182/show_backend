'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

/**
 * @service 角色 roles
 */

class RolesService extends Service {
    async index(payload) {
        const { ctx } = this;
        const { limit, offset, prop_order, order } = payload;
        const where = payload.where;
        const Order = [];
        prop_order && order ? Order.push([prop_order, order]) : null;
        // 先检查一下该用户是否有超级管理员角色
        const hasSuperAdminRole = await ctx.model.UserRoles.findOne({
            where: {
                user_id: ctx.currentRequestData.userInfo.id,
                role_id: 1,
            },
        });
        if (!hasSuperAdminRole) {
            if (where[Op.and]) {
                where[Op.and].push({ id: { [Op.ne]: 1 } });
            } else {
                where[Op.and] = [{ id: { [Op.ne]: 1 } }];
            }
        }
        return await ctx.model.Roles.findAndCountAll({
            limit,
            offset,
            where,
            order: Order,
        });
    }

    async create(payload) {
        const { ctx } = this;
        return await ctx.model.Roles.create(payload);
    }

    async destroy(payload) {
        const { ctx } = this;
        const allRoles = await ctx.model.Roles.findAll({
            where: { id: payload.ids },
        });
        if (!allRoles.every(e => e.is_default !== 1)) {
            return { __code_wrong: 40000 };
        }
        // 角色已经被用户使用，不允许删除
        const relatedData = await ctx.model.UserRoles.findAndCountAll(
            {
                where: { role_id: payload.ids },
            }
        );
        // 在删除资源时，如果有角色关联了该资源，则不允许删除
        if (relatedData.count > 0) {
            return {
                __code_wrong: 40001
            }
        }
        return await ctx.model.Roles.destroy({ where: { id: payload.ids } });
    }

    async update(payload) {
        const { ctx } = this;
        return await ctx.model.Roles.update(payload, { where: { id: payload.id } });
    }

    async show(id) {
        const { ctx } = this;
        return await ctx.model.Roles.findOne({ where: { id } });
    }

    async updateIsDefault(payload) {
        const { ctx } = this;
        const transaction = await ctx.model.transaction();
        // Roles 表中某个角色的 is_default 字段值为 1，同时将其他角色的 is_default 字段值设为 0。
        await ctx.model.Roles.update({ is_default: 0 }, { where: { is_default: 1 }, transaction });
        const res = await ctx.model.Roles.update({ is_default: 1 }, { where: { id: payload.id }, transaction });
        if (res && res[0] === 1) {
            await transaction.commit();
            return true;
        }
        await transaction.rollback();
        return false;
    }
}

module.exports = RolesService;