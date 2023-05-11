'use strict';

const Controller = require('egg').Controller;

class DefaultController extends Controller {
  async ping() {
    const { ctx, app } = this;
    console.log('ping');
    const message = ctx.args[0];
    await ctx.socket.emit('res', `Hi! I've got your message: ${ message }`);
  }

  async ack() {
    const { ctx, app } = this;
    const message = ctx.args[0];
    // app.io.sockets.sockets是个包含所有连接的Map对象,可以通过size属性获取当前连接数
    const connectedClients = app.io.sockets.sockets.size;
    console.log('ack-------------1',message,`客户端的个数是${connectedClients}`);
    // ctx中是当前连接的socket对象,使用ctx.socket.emit是给当前连接的客户端发送消息,
    // 使用app.io.sockets.emit是给所有连接的客户端发送消息
    // ctx.socket.emit('packet', message);
    app.io.sockets.emit('packet', message);
    await app.redis.del(ctx.helper.redisKeys.socketBaseSocketId(message.id));
  }

}

module.exports = DefaultController;
