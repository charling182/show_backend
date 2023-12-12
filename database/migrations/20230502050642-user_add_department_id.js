'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'department_id', {
      type: Sequelize.INTEGER(11).UNSIGNED,
      allowNull: false,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('users', 'department_id');
  },
};
