'use strict';

const { Model } = require('sequelize');

module.exports = app => {
  class User extends Model { }

  User.init(
    {
      id: {
        type: app.Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      department_id: {
        type: app.Sequelize.INTEGER,
        allowNull: true,
        comment: '部门id',
        defaultValue: 0,
      },
      username: {
        type: app.Sequelize.STRING(60),
        allowNull: false,
        unique: true, // 唯一
        comment: '用户名',
      },
      nickname: {
        type: app.Sequelize.STRING(60),
        comment: '昵称',
        allowNull: false,
        defaultValue: '',
      },
      password: {
        type: app.Sequelize.STRING(64),
        allowNull: false,
        comment: '用户密码',
      },
      email: {
        type: app.Sequelize.STRING(60),
        unique: true,
        comment: '邮箱',
      },
      state: {
        type: app.Sequelize.TINYINT,
        allowNull: false,
        defaultValue: 1,
        comment: '状态：0.停用、1.正常',
      },
      phone: {
        type: app.Sequelize.STRING(15),
        comment: '手机号',
        allowNull: false,
        defaultValue: '',
      },
      avatar: {
        type: app.Sequelize.STRING(255),
        comment: '头像url',
        allowNull: false,
        defaultValue: '',
      },
      company: {
        type: app.Sequelize.STRING(80),
        comment: '国家',
        allowNull: false,
        defaultValue: '',
      },
      city: {
        type: app.Sequelize.STRING(80),
        comment: '城市',
        allowNull: false,
        defaultValue: '',
      },
      last_login: {
        type: app.Sequelize.DATE,
        comment: '最后登录时间',
        allowNull: true,
      },
      deleted_at: {
        allowNull: true,
        type: app.Sequelize.DATE,
      },
      created_at: {
        allowNull: false,
        type: app.Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: app.Sequelize.DATE,
      },
    },
    {
      sequelize: app.model,
      tableName: 'user',
      paranoid: true, // 软删除
      charset: 'utf8mb4', // 设置字符集
      collate: 'utf8mb4_unicode_ci', // 设置校对集
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );
  User.associate = function () {
    // 部门和用户是一对多的关系,用户只属于一个部门
    User.hasOne(app.model.Departments, { foreignKey: 'id', sourceKey: 'department_id', as: 'department' });

    User.belongsToMany(app.model.Roles, {
      through: app.model.UserRoles,
      foreignKey: 'user_id',
      otherKey: 'role_id',
    });
    User.belongsToMany(app.model.Projects, {
      through: app.model.UserProjects,
      foreignKey: 'user_id',
      otherKey: 'project_id',
    });
  };

  return User;
};
