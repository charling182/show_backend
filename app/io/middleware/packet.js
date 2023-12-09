'use strict';

module.exports = app => {
  return async (ctx, next) => {
    const {
      packet,
      app: { redis },
    } = ctx;
    console.log('什么时候经过该中间件---------');
    // packetMiddleware 主要用于处理传入的数据包，例如在服务器端对接收到的数据包进行验证、修改或拦截。
    // 它提供了一个机制来对数据包进行处理并在需要时执行一些自定义逻辑。
    // 对于发送数据包，Socket.IO 提供了不同的方式，例如使用 socket.emit 发送事件、
    // 使用 socket.send 发送消息等。这些发送数据包的方法并不会经过 packetMiddleware 中间件。发送数据包时，通常会直接将数据包发送给目标客户端，而不经过中间件处理。

    // ctx.socket.emit('packet', 'packet received!');
    // if (packet && packet[0] === 'ack') {
    //   await redis.del('12341234');
    // }
    await next();
  };
};
