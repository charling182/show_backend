'use strict';
module.exports = app => {
  const { STRING, INTEGER, TINYINT, DATE } = app.Sequelize;
  const roles = app.model.define('roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: INTEGER(11).UNSIGNED,
    },
    name: {
      allowNull: false,
      unique: true,
      type: STRING(50),
    },
    is_default: {
      type: TINYINT(1),
      allowNull: false,
      defaultValue: 0,
      comment: '是否为默认角色：0.非默认、1.默认',
    },
    created_at: {
      allowNull: false,
      type: DATE
    },
    updated_at: {
      allowNull: false,
      type: DATE
    }
  }, {});
  roles.associate = function(models) {
    // associations can be defined here
    app.model.Roles.belongsToMany(app.model.Permissions, {
      through: app.model.RolePermissions, // 指定关联表，这里是 RolePermissions 中间表
      foreignKey: 'role_id', // 指定连接此模型的外键字段名称，这里是 RolePermissions 表中的 role_id
      otherKey: 'permission_id', // 指定关联模型的外键字段名称，这里是 RolePermissions 表中的 permission_id
    });
    app.model.Roles.belongsToMany(app.model.Menus, {
      through: app.model.RoleMenus,
      foreignKey: 'role_id',
      otherKey: 'menu_id',
    });
  };
  return roles;
};