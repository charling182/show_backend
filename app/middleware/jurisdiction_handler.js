'use strict';

module.exports = (option, app) => {
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
      // 取出请求头中的authorization,这是jwt令牌
      const token = ctx.request.headers[app.config.jwt.tokenName] && ctx.request.headers[app.config.jwt.tokenName].split(app.config.jwt.tokenType + ' ')[1];
      if (!token) return ctx.helper.body.UNAUTHORIZED({ ctx });
      const decoded = await ctx.app.jwt.verify(token, ctx.app.config.jwt.secret);
      ctx.currentRequestData = decoded.data;
      console.log('经过中间件-----', ctx.request.headers);
      await next();
    } catch (err) {
      console.log('报错了------------', err);
      // app.emit('error', err, this);
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
