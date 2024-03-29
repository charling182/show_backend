'use strict';
const child_process = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = {
    schedule: {
        cron: '0 1 * * *', // 每天一点执行一次,第一个字段是分钟（0），第二个字段是小时（1），后面的三个星号表示日期、月份和星期可以是任意值
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
            ctx.logger.info(`Database backed up successfully.`);
        });

        // 删除旧的备份文件,只保留最新的三个备份文件
        const { backup_dir } = ctx.app.config.static;

        const grandparentDir = path.dirname(path.dirname(__dirname));

        const backupDir = path.join(grandparentDir, backup_dir);


        // 获取备份目录中的所有文件
        const files = fs.readdirSync(backupDir);

        // 过滤出所有以 _backup.sql 结尾的文件
        const backupFiles = files.filter(file => file.endsWith('_backup.sql'));

        // 根据文件名对文件进行排序
        backupFiles.sort((a, b) => b.localeCompare(a));

        // 获取除了最新的三个文件之外的所有文件
        const filesToDelete = backupFiles.slice(3);

        // 删除这些文件
        filesToDelete.forEach(file => fs.unlinkSync(path.join(backupDir, file)));
    },
};