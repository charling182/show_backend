'use strict';

module.exports = (option, app) => {
  const context = app.createAnonymousContext();

  return async function (ctx, next) {
    try {
      // 如果是非backend请求则跳过验证
      if (!/^\/backend\//.test(ctx.request.url)) {
        await next();
        return;
      }
      // 检查当前请求的 URL 是否在 ignore 列表中
      const isIgnored = app.config.jwt.ignore.some(ignoredPath => ctx.request.url.startsWith(ignoredPath));
      // 如果在 ignore 列表中，跳过 JWT 验证
      if (isIgnored) {
        await next();
        return;
      }
      const action = ctx.request.method.toLowerCase();
      const url = ctx.request.url.replace(/\?.*/g, '');
      const Permissions = await app.redis.hgetall(ctx.helper.redisKeys.permissionsBaseActionUrl(action, url));
      // 取出请求头中的authorization,这是jwt令牌
      const token = ctx.request.headers[app.config.jwt.tokenName] && ctx.request.headers[app.config.jwt.tokenName].split(app.config.jwt.tokenType + ' ')[1];
      const decoded = await ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      // 如果当前登录人是超级管理员，则直接通过,无需校验任何资源权限
      const userInfo = decoded.data.userInfo;
      // redis获取当前用户的所有角色id
      // redis.smembers 是 Redis 的一个命令，用于获取指定集合（Set）中的所有成员。
      let roleIds = await app.redis.smembers(ctx.helper.redisKeys.userRoleIdsBaseUserId(userInfo.id));
      // 先去redis中获取当前用户的roleIds,如果为空，则到数据库中获取, 并写入redis中,在getUserRoleIds获取时会有写入逻辑
      if (!roleIds.length) {
        roleIds = await context.service.userRoles.getUserRoleIds({
          user_id: userInfo.id,
        });
      }
      console.log('roleIds------------', roleIds);
      // roleIds是字符串数组，如果包含1，则为超级管理员
      if (roleIds && roleIds.includes('1')) {
        ctx.currentRequestData = decoded.data;
        await next();
        return;
      }
      // 1. 确认当前请求是否在资源中，如果不在，则返回404，如果存在则根据资源状态处理
      console.log('Permissions------------', Permissions.state, Permissions.authentication, Permissions.authorization, url);
      // 2. 资源存在, 状态为0，则返回404
      if (!(Permissions.state === '1')) {
        ctx.helper.body.NOT_FOUND({ ctx, status: 404 });
      } else {
        // 3. 资源存在，且需要认证
        if (Permissions.authentication === '1') {
          // 如果认证模式为jwt
          if (app.config.verification_mode === 'jwt') {
            if (!token) return ctx.helper.body.UNAUTHORIZED({ ctx });
            // 如果redis中存在此token，则认为此token已加入黑名单，则返回401
            if ((await app.redis.exists(token)) === 1) {
              return ctx.helper.body.UNAUTHORIZED({ ctx });
            }
            ctx.currentRequestData = decoded.data;
          } else {
            ctx.helper.body.UNAUTHORIZED({ ctx });
            return;
          }
          // 4. 资源存在，需要鉴权
          if (Permissions.authorization === '1') {
            // redis.sunion 是 Redis 的命令之一，用于获取多个集合的并集。
            const userPermissions = await app.redis.sunion(roleIds.map(id => ctx.helper.redisKeys.rolePermissionsBaseRoleId(id)));
            const Permissions = userPermissions.filter(e => e === `${action}_${url}`);
            console.log('userPermissions------------', roleIds, Permissions, Permissions.length);
            Permissions.length > 0 ? await next() : ctx.helper.body.FORBIDDEN({ ctx });
          } else {
            await next();
          }
        } else {
          await next();
        }
      }
    } catch (err) {
      // 如果是token过期，status为202
      if (err.name === 'TokenExpiredError') {
        ctx.helper.body.UNAUTHORIZED({ ctx, msg: err.message, status: 202 });
      } else {
        ctx.helper.body.UNAUTHORIZED({ ctx, msg: err.message });
      }
      // throw err;
    }
  };
};
