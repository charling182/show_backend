'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: 1,
        username: 'admin',
        nickname: '超级管理员',
        password: 'b4220bd49c7d349ba8c468b20f1f29ef7e12badd87529443368896fa528e6372',
        email: '876@example.com',
        state: 1,
        phone: '18515481949',
        avatar: 'https://example.com/avatar.jpg',
        company: 'China',
        city: 'Beijing',
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
