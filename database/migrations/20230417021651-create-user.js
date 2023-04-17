'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE, TINYINT } = Sequelize;
    await queryInterface.createTable('user', {
      id: {
        type: INTEGER.UNSIGNED,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      username: {
        type: STRING(60),
        allowNull: false,
        unique: true,
        comment: '用户名',
      },
      nickname: {
        type: STRING(60),
        comment: '昵称',
        allowNull: false,
        defaultValue: '',
      },
      password: {
        type: STRING(64),
        allowNull: false,
        comment: '用户密码',
      },
      email: {
        type: STRING(60),
        unique: true,
        comment: '邮箱',
      },
      state: {
        type: TINYINT,
        allowNull: false,
        defaultValue: 0,
        comment: '状态：0.停用、1.正常',
      },
      phone: {
        type: STRING(15),
        comment: '手机号',
        allowNull: false,
        defaultValue: '',
      },
      avatar: {
        type: STRING(255),
        comment: '头像url',
        allowNull: false,
        defaultValue: '',
      },
      company: {
        type: STRING(80),
        comment: '国家',
        allowNull: false,
        defaultValue: '',
      },
      city: {
        type: STRING(80),
        comment: '城市',
        allowNull: false,
        defaultValue: '',
      },
      last_login: {
        type: DATE,
        comment: '最后登录时间',
        allowNull: true,
      },
      deleted_at: {
        type: DATE,
        comment: '删除时间',
        allowNull: true,
      },
      created_at: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('user');
  },
};
