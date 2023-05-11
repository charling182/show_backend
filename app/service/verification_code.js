'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');

class VerificationCodeService extends Service {

  async findOne(id) {
    const { ctx } = this;
    return await ctx.model.VerificationCode.findOne({ where: { id } });
  }

  async findAll(payload) {
    const { ctx } = this;
    const { limit, offset, prop_order, order } = payload;
    const where = payload.where;
    const Order = [];
    prop_order && order ? Order.push([prop_order, order]) : null;
    return await ctx.model.VerificationCode.findAndCountAll({
      limit,
      offset,
      where,
      order: Order,
    });
  }

  async create(payload) {
    const { ctx, app } = this;
    const { target } = payload;
    const expiration_time = app.dayjs()
      .add(15, 'minute')
      .format('YYYY-MM-DD HH:mm:ss');

    const code = Math.random()
      .toString()
      .substring(2, 8);
    app.mailer.send({
      from: '"Charling" <1650070770@qq.com>', // sender address, [options] default to user
      // // Array => ['bar@example.com', 'baz@example.com']
      to: [target], // list of receivers
      subject: 'Charling验证码邮件', // Subject line
      text: code, // plain text body
      html: `<div style="display: flex;flex-direction: column;justify-content: center;align-items: center;
                  width: 300px;height: 300px;box-shadow: 0px 0px 10px #ccc;border-radius: 30px;margin: 66px auto;">
                <img width="100" src="/public/image/charling.png" alt="">
                <span style="line-height: 36px;">来自 Charling 的邮箱验证码：</span>
                <div style="font-weight: 600;font-size: 22px;line-height: 46px;">${code}</div>
              </div>`, // html body
    });
    return await ctx.model.VerificationCode.create({
      ...payload,
      code,
      expiration_time,
    });
  }

  async update(payload) {
    const { ctx } = this;
    return await ctx.model.VerificationCode.update(payload, {
      where: { id: payload.id },
    });
  }

  async destroy(payload) {
    const { ctx } = this;
    return await ctx.model.VerificationCode.destroy({
      where: { id: payload.ids },
    });
  }

  /**
   * 验证此验证码是否有效,无效就更新为无效(available = 0)
   * @param payload
   * @return {Promise<*>}
   */
  async verification(payload) {
    const { ctx, app } = this;
    const { target, code } = payload;
    const current_time = app.dayjs()
      .format('YYYY-MM-DD hh:mm:ss');
    const res = await ctx.model.VerificationCode.findOne({
      where: {
        target,
        code,
        available: 1,
        expiration_time: { [Op.gt]: current_time }, // 大于当前时间
      },
    });
    if (res) {
      // res 中包含的是从数据库查询到的数据，但是这些数据被封装在一个 Sequelize 实例对象中。
      // update 是 Sequelize 实例的一个内置方法，您可以用它来更新实例并将更改保存到数据库。
      res.update({ ...res, available: 0 });
    }
    return res;
  }
}

module.exports = VerificationCodeService;
