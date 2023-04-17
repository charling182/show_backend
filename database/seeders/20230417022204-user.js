'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: 1,
        username: 'admin',
        nickname: '管理员',
        password: '123456',
        email: 'admin@example.com',
        state: 1,
        phone: '123456789',
        avatar: 'https://example.com/avatar.jpg',
        company: 'China',
        city: 'Beijing',
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
