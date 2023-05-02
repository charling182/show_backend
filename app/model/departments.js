'use strict';
module.exports = app => {
  const Sequelize = app.Sequelize;

  const department = app.model.define(
    'departments',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER(11).UNSIGNED,
      },
      name: {
        type: Sequelize.STRING(60),
        allowNull: false,
        unique: true,
        defaultValue: '',
        comment: '部门名称',
      },
      owner_id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        defaultValue: 0,
        comment: '拥有者ID',
      },
      parent_id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        comment: '父部门ID',
      },
      sort: {
        type: Sequelize.INTEGER(11),
        allowNull: false,
        defaultValue: 0,
        comment: '排序，越大越靠前',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    },
    {}
  );
  department.associate = function(models) {
    // associations can be defined here
  };
  return department;
};
