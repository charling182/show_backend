'use strict';
const lodash = require('lodash');

module.exports = {
  schedule: {
    interval: 1000 * 2, // 2s间隔
    type: 'worker', // 指定所有的 worker 都需要执行
    disable: false, // 配置该参数为 true 时，这个定时任务不会被启动。
    immediate: false, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
  },
  async task(ctx) {
    const { app: { redis, io }, helper, socket } = ctx;
    const socketKeys = await redis.keys(helper.redisKeys.socketBaseSocketId('*'));
    // 同上一次获取比较，相同的key代表最少2秒，最多4秒没有收到ACK反馈，则重发
    // 没有直接获取到就重发，是为了，避免小于2秒存入的重发。
    // lodash.intersection 是 Lodash 库提供的一个函数，用于返回多个数组之间的交集（即共同的元素）。
    // 它接受多个数组作为参数，并返回一个新数组，其中包含所有输入数组中共同存在的元素。
    const intersection = lodash.intersection(ctx.app.socketIdOnRedisKeys, socketKeys);
    const nsp = io.of('/');
    try {
      intersection.forEach(id => {
        // redis.get 命令专门用于获取字符串类型键的值。
        redis.get(id, (err, data) => {
          if (!err) {
            const emitData = JSON.parse(data);
            const socket = nsp.to(emitData[1].clientId);
            socket.emit(...emitData);
          }
        });
      });
    } catch (e) {
      throw e;
    }
    // 本次覆盖存入
    ctx.app.socketIdOnRedisKeys = socketKeys;
  },
};
