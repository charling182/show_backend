'use strict';

module.exports = app => {
  return async (ctx, next) => {
    const { socket, logger } = ctx;
    const { socketOnlineUserRoomName } = app.config;
    // 创建了一个Socket.IO的命名空间对象,你可以在该命名空间下注册事件处理程序、
    // 发送和接收特定于该命名空间的消息，以及管理与该命名空间相关的Socket连接
    const nsp = app.io.of('/');
    try {
      const { accessToken, userId } = socket.handshake.query;
      const res = await app.redis.exists(accessToken);
      const token = accessToken.split('Bearer ')[1];
      console.log('开始连接,输出socket.id----------!', socket.id, accessToken, userId);
      // 如果token 不存在，或者在redis黑名单，则断开连接
      // redis.exists 命令用于在 Redis 中检查一个或多个键是否存在于数据库中
      if (!token || (await app.redis.exists(accessToken)) === 1) {
        socket.disconnect();
      }
      await app.jwt.verify(token, app.config.jwt.secret);
      // 加入在线用户room
      socket.join(socketOnlineUserRoomName, () => {
        // 之前出现了新加入用户和已在线用户同时收到了join事件的情况,应该是setTimeout的问题,
        // nsp.adapter.clients([socketOnlineUserRoomName], (err, clients),clients参数
        // 可能有是包含了新加入用户,有时没有
        // setTimeout(() => {
        // 给已在线用户发送join
        console.log('join之前----------');
        ctx.helper.sendSocketToClientOfRoom({ socketId: socket.id }, 'join');
        nsp.adapter.clients([socketOnlineUserRoomName], (err, clients) => {
          if (err) logger.error(err);
          const ids = new Set(clients);
          ids.add(socket.id);
          console.log('ids----------', ids);
          // 给当前新连线用户发送online
          const _message = ctx.helper.parseSocketMsg(Array.from(ids), socket.id, 'online');
          const emitData = ['sync', _message];
          // socket是当前新连接的socket对象,所以online发给了当前新连接的客户端
          socket.emit(...emitData);
          // 存入redis，接收到ACK则删除，否则在 this.app.config.socketRedisExp 时间内多次重发
          // 使用 redis.setex 命令可以在设置键值对的同时指定键的过期时间。
          // 当键过期后，对应的键值对会被自动删除。这在一些临时性数据存储或缓存的场景中非常有用。
          app.redis.setex(ctx.helper.redisKeys.socketBaseSocketId(_message.id), app.config.socketRedisExp, JSON.stringify(emitData));
        });
        // }, []);
      });
      // 获取用户参与的项目，根据项目ID创建room
      const userProjects = await ctx.model.UserProjects.findAll({
        where: { user_id: userId },
        attributes: ['project_id'],
      });
      userProjects.forEach(item => {
        const roomName = `${app.config.socketProjectRoomNamePrefix}${item.project_id}`;
        socket.join(roomName, () => {
          // 在初次连接websocket的时候,似乎项目room,没有必要去发送加入或者离开的消息
        });
      });
      // 获取当前房间
      // const rooms = nsp.adapter.rooms;
      // 监听客户端离线事件
      // 之间未添加离线事件侦听器导致,页面刷新时旧的clientid未能移除,导致重复发送消息
      // 在大多数情况下，你不需要手动移除这个监听器。当客户端断开连接时，Socket.IO 会自动清理与该客户端相关的所有资源，包括事件监听器。
      socket.on('disconnect', () => {
        console.log('disconnect---------', '刷新页面是否触发断开连接事件查看----------', socket.id);
        socket.leave(socketOnlineUserRoomName, () => {
          ctx.helper.sendSocketToClientOfRoom({ socketId: socket.id }, 'leave');
        });
      })
    } catch (err) {
      console.log('err----------', err);
      // app.logger.errorAndSentry(err);
      socket.emit('disconnect', 'disconnect!');
      socket.disconnect();
    }
    await next();
  };
};
