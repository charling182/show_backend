'use strict';

module.exports = app => {
    return async (ctx, next) => {
      console.log('connection---------', '据说仅仅是连接一次');
        ctx.socket.emit('res', '据说仅仅是连接一次,不会多次经过此中间件');
        await next();
        // execute when disconnect.
        // console.log('disconnection!');
    };
};
