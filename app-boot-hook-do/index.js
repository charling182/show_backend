'use strict';
module.exports = {
  // 资源数据缓存到redis
  async permissionsToRedis(app) {
    // 用于在非 HTTP 请求场景下创建一个匿名的应用上下文对象。
    // Context 对象包含了当前请求的上下文信息，例如请求参数、请求头、Cookie 等。它提供了一系列的方法和属性，用于获取和操作当前请求的相关信息
    const ctx = await app.createAnonymousContext();
    const { models } = app.model;
    const { redis } = app;
    const permissionsPromise = models.permissions.findAll({ limit: 10000 });
    const rolesPromise = models.roles.findAll({
      attributes: ['id', 'name'],
      include: [{ attributes: ['id', 'url', 'action'], model: models.permissions }],
      limit: 10000,
      raw: false,
    });
    const redisKeysPermissions = redis.keys('permissions:url:*');
    const [permissions, roles, redisKeys] = await Promise.all([permissionsPromise, rolesPromise, redisKeysPermissions]);
    // Redis Pipeline 是一种优化技术，它允许在一次网络往返中发送多个命令给 Redis 服务器，
    // 从而减少网络延迟带来的性能损失。通过使用 Pipeline，可以将多个命令打包发送给 Redis，
    // 并在执行时一次性获取它们的结果，而不需要等待每个命令的返回。
    // 当所有命令添加完成后，可以使用 pipeline.exec() 方法来执行
    // Pipeline 中的所有命令，并返回一个包含命令结果的数组。
    // 通过一次网络往返，Redis 服务器将按照添加的顺序依次执行命令，并将结果返回给客户端。
    const pipeline = redis.pipeline();
    // 删除所有permissions:url:*
    redisKeys.forEach(v => pipeline.del(v));
    permissions.forEach(v => pipeline.hmset(ctx.helper.redisKeys.permissionsBaseActionUrl(v.action, v.url), v.dataValues));
    // 根据角色id存储对应资源
    const rolesArr = JSON.parse(JSON.stringify(roles));
    rolesArr.forEach(e => {
      pipeline.del(ctx.helper.redisKeys.rolePermissionsBaseRoleId(e.id));
      if (e.permissions.length) {
        const arr = [];
        e.permissions.forEach(permission => arr.push(`${permission.action}_${permission.url}`));
        pipeline.sadd(ctx.helper.redisKeys.rolePermissionsBaseRoleId(e.id), arr);
      }
    });
    await pipeline.exec();
  },
};
