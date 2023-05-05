'use strict';

const Service = require('egg').Service;

class MenuService extends Service {
  async findAll(payload) {
    const { ctx } = this;
    const { limit, offset, prop_order, order } = payload;
    const where = payload.where;
    const Order = [];
    prop_order && order ? Order.push([prop_order, order]) : null;
    return await ctx.model.Menus.findAndCountAll({
      limit,
      offset,
      where,
      order: Order,
    });
  }

  async findOne(id) {
    const { ctx } = this;
    return await ctx.model.Menus.findOne({ where: { id } });
  }

  async create(payload) {
    const { ctx } = this;
    return await ctx.model.Menus.create(payload);
  }

  async update(payload) {
    const { ctx } = this;
    return await ctx.model.Menus.update(payload, { where: { id: payload.id } });
  }

  async destroy(payload) {
    const { ctx } = this;
    const res = await ctx.model.Menus.findAll({
      where: { parent_id: payload.ids },
    });
    // 如果当前删除id有子菜单
    if (res.length > 0) {
      const err = new Error('删除失败，当前菜单存在子菜单。');
      err.parent = {};
      err.parent.errno = 1451;
      throw err;
    }
    return await ctx.model.Menus.destroy({ where: { id: payload.ids } });
  }

  /**
   * 根据角色获取菜单
   * @return {Promise<*[]|*>}
   */
  async userMenus() {
    //  重点查看
    // 这里的 include 是 Sequelize 中用于表示关联查询的选项，可以通过嵌套 include 实现多表关联查询。在这段代码中，有三个模型之间存在关联，分别是 Users、Roles 和 Menus。其中 Users 和 Roles 是一对多的关系，Roles 和 Menus 也是一对多的关系。因此，为了查询某个用户的信息以及其所对应的角色和菜单信息，就需要通过嵌套 include 实现多表关联查询。

    // 具体来说，这段代码的查询逻辑是这样的：
    
    // 从 Users 表中查询 id 字段为当前登录用户的 id 的记录，并将结果赋值给 data 变量。
    // 在查询结果中，包含 Users 和 Roles 两个模型的所有字段，以及 Roles 和 Menus 两个模型中除 created_at 和 updated_at 之外的所有字段。
    // 在查询结果中，只包含 id 字段为当前登录用户的 id 的记录。
    // raw: false 表示返回的查询结果是 Sequelize 模型实例，而不是 JSON 数据。
    const { ctx, app } = this;
    let data = await ctx.model.Users.findAll({
      include: [
        {
          model: ctx.model.Roles,
          // attributes: {
          //   exclude: [ 'user_roles', 'updated_at' ],
          // },
          include: [
            {
              model: ctx.model.Menus,
              attributes: {
                exclude: ['created_at', 'updated_at'],
              },
            },
          ],
        },
      ],
      where: {
        id: ctx.currentRequestData.userInfo.id,
      },
      raw: false,
    });
    // 如果没有则直接返回空数组
    if (data.length === 0) {
      return [];
    }
    data = data[0].roles;
    // 去重
    const arr = [];
    data.forEach((e, i) => {
      e.menus.forEach((ee, ii) => {
        ee.__roles = {
          id: e.id,
          name: e.name,
        };
        arr.push(ee);
      });
    });
    data = app.lodash.uniqWith(arr, (a, b) => a.id === b.id);
    data = data.sort((a, b) => b.sort - a.sort);
    return data;
  }
}

module.exports = MenuService;
