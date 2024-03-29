'use strict';

const Service = require('egg').Service;

class ConfigurationService extends Service {
  async update(payload) {
    const { ctx } = this;
    return await ctx.model.Configuration.update(payload, {
      where: { id: payload.id },
    });
  }

  async findRsaPublicKey(id) {
    const { ctx } = this;
    return await ctx.model.Configuration.findOne({
      where: { id },
      attributes: { exclude: ['rsa_private_key'] },
    });
  }
}

module.exports = ConfigurationService;
