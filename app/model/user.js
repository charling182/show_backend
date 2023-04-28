'use strict';

const { Model } = require('sequelize');

module.exports = app => {
  class User extends Model {}

  User.init(
    {
      id: {
        type: app.Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: app.Sequelize.STRING(60),
        allowNull: false,
        unique: true,
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
        defaultValue: '0',
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
      timestamps: true,
      underscored: true,
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
      scopes: {
        withPassword: {
          attributes: {},
        },
      },
    }
  );

  return User;
};
