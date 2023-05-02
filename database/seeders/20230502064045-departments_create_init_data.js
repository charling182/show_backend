'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('departments', [
      {
        id: 1,
        name: '根部门',
        owner_id: 43,
        parent_id: 0,
        sort: 66,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 3,
        name: '研发部',
        owner_id: 0,
        parent_id: 1,
        sort: 23,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        name: '产品部',
        owner_id: 0,
        parent_id: 1,
        sort: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
  ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('departments', null, {});
  }
};
