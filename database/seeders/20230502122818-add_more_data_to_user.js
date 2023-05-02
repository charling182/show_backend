'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: 2,
        username: 'grthhrhr',
        nickname: '个人体会如何如何',
        password: 'gdgdgdgd',
        email: '453@example.com',
        state: 1,
        phone: '18234564321',
        avatar: '',
        company: 'China',
        city: 'Beijing',
        department_id: 1,
        last_login: null,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        username: '防护服回复',
        nickname: '当前温度',
        password: 'uhgfvc',
        email: '4531@example.com',
        state: 1,
        phone: '18234364321',
        avatar: '',
        company: 'China',
        city: 'Beijing',
        department_id: 1,
        last_login: null,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 4,
        username: '苟富贵很符合',
        nickname: '访问',
        password: '34rtyhj',
        email: '45331@example.com',
        state: 1,
        phone: '18264364321',
        avatar: '',
        company: 'China',
        city: 'Beijing',
        department_id: 1,
        last_login: null,
        deleted_at: null,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ];

    await queryInterface.bulkInsert('user', users);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('user', {});
  },
};
