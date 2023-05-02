'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('user', 'department_id', {
      type: Sequelize.INTEGER(11).UNSIGNED,
      allowNull: false,
    });
  },

  down: async queryInterface => {
    await queryInterface.removeColumn('user', 'department_id');
  },
};
