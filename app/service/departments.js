'use strict';

const Service = require('egg').Service;


class DepartmentService extends Service {
    async findAll(payload) {
        const { ctx } = this;
        const { limit, offset, prop_order, order } = payload;
        const where = payload.where;
        const Order = [];
        prop_order && order ? Order.push([ prop_order, order ]) : null;
        return await ctx.model.Departments.findAndCountAll({
          limit,
          offset,
          where,
          order: Order,
        });
      }

      async create(payload) {
        const { ctx } = this;
        return await ctx.model.Departments.create(payload);
      }

      async update(payload) {
        const { ctx } = this;
        return await ctx.model.Departments.update(payload, {
          where: { id: payload.id },
        });
      }

    async findOne(id) {
        const { ctx } = this;
        return await ctx.model.Departments.findOne({ where: { id } });
    }
    // individualHooks 是 Sequelize 提供的一个参数选项，用于指示是否启用模型的 beforeDestroy 
    // 和 afterDestroy 钩子函数。在上面的代码中， individualHooks 设置为 true，意味着在删除部门记录时，
    // Sequelize 将触发模型中的 beforeDestroy 和 afterDestroy 钩子函数。这通常用于在删除记录前和删除记录后执行某些操作
    // ，例如删除关联记录、更新其他记录等。
    async destroy(payload) {
        const { ctx } = this;
        return await ctx.model.Departments.destroy({ where: { id: payload.ids }, individualHooks: true });
    }
}

module.exports = DepartmentService;
