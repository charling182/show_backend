'use strict';
const { exec } = require('child_process');
// exec是 Node.js 中的 child_process 模块的一个方法。
// 它可以用于在 Node.js 程序中执行 shell 命令。当您在脚本中调用 exec 时，
// 它将创建一个新的子进程并执行指定的命令。exec 函数接受一个回调函数作为参数，
// 当命令执行完成时（无论成功还是失败），回调函数会被调用。

// 将 exec 函数封装成返回 Promise 的函数
const execPromise = command => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
};

const runCommandsInOrder = async () => {
  try {
    // 执行数据库迁移命令
    console.log('Running migrations...');
    const migrationResult = await execPromise('sequelize db:migrate');
    console.log('Migration result:', migrationResult);
    console.log('Migrations completed.');

    // 在迁移完成后执行种子文件命令
    console.log('Running seeders...');
    const seederResult = await execPromise('sequelize db:seed:all');
    console.log('Seeder result:', seederResult);
    console.log('Seeders completed.');
  } catch (error) {
    console.error('Error:', error);
  }
};

runCommandsInOrder();
