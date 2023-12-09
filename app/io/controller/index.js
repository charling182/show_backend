'use strict';

const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async ping() {
    const { ctx, app } = this;
    console.log('ping');
    const message = ctx.args[0];
    await ctx.socket.emit('res', `Hi! I've got your message: ${message}`);
  }

  // 在socket发消息前,每次都会存一下socketId,在收到ack后删除,否则在规定时间内会重发
  async ack() {
    const { ctx, app } = this;
    // app.io.sockets.sockets是个包含所有连接的对象,键名为socket.id,键值为socket对象
    // const connectedClients = app.io.sockets.sockets;
    // console.log('ack-------------1', `客户端的个数是${connectedClients}`, Object.keys(connectedClients));
    const message = ctx.args[0];
    await app.redis.del(ctx.helper.redisKeys.socketBaseSocketId(message.id));
  }
}

module.exports = DefaultController;
