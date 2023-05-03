'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('roles', [
      {
        id: 1,
        name: '超级管理员',
        is_default: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: '管理员',
        is_default: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: '普通用户',
        is_default: 0,
        created_at: new Date(),
        updated_at: new Date(),
      },
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('roles', null, {});
  }
};
