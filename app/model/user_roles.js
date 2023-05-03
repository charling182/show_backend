'use strict';
module.exports = app => {
  const Sequelize = app.Sequelize;
  const user_roles = app.model.define('user_roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER(11).UNSIGNED,
    },
    user_id: {
      type: Sequelize.INTEGER(11).UNSIGNED,
      allowNull: false,
      comment: '用户ID',
      references: { //  references 是指该字段在数据库层面的外键约束，它指定了该字段引用了 users 表中的 id 字段作为外键。
        model: 'user',  // 这里的model对应的是数据库中的表名
        key: 'id', // 这里的key对应的是数据库中的字段名
      }, // 这意味着，如果 users 表中的某个 id 值被删除了，与之相关的所有 user_roles 记录都应该被删除或者进行某种处理（例如将 user_id 置为 null）
      onUpdate: 'NO ACTION', // 更新时操作
      onDelete: 'NO ACTION', // 删除时操作
    },
    role_id: {
      type: Sequelize.INTEGER(11).UNSIGNED,
      allowNull: false,
      comment: '用户ID',
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'NO ACTION',
      onDelete: 'NO ACTION',
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  }, {});
  user_roles.associate = function(models) {
    // associations can be defined here
  };
  return user_roles;
};