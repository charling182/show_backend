'use strict';
const child_process = require('child_process');

module.exports = {
    schedule: {
        interval: 1000 * 60, // 一分钟执行一次,测试用
        type: 'worker', // 指定所有的 worker 都需要执行
        disable: false, // 配置该参数为 true 时，这个定时任务不会被启动。
        immediate: false, // 配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
    },
    async task(ctx) {
        const date = new Date();
        const timestamp = date.getFullYear().toString() +
            (date.getMonth() + 1).toString().padStart(2, '0') +
            date.getDate().toString().padStart(2, '0') +
            date.getHours().toString().padStart(2, '0') +
            date.getMinutes().toString().padStart(2, '0') +
            date.getSeconds().toString().padStart(2, '0');
        // -p${process.env.MySqlPassword} 之间不能有空格,否则会打断自动进程,需要手动输入密码
        const dumpCommand = `mysqldump -h ${process.env.MySqlHost} -P ${process.env.MySqlPort} -u ${process.env.MySqlUserName} -p${process.env.MySqlPassword} ${process.env.MySqlDatabase} > ./backup/${timestamp}_backup.sql`;

        child_process.exec(dumpCommand, (error, stdout, stderr) => {
            if (error) {
                ctx.logger.error(`Error executing ${dumpCommand}: ${error}`);
                return;
            }
            console.log('备份成功');
            ctx.logger.info(`Database backed up successfully.`);
        });
    },
};