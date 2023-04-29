'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('verification_code', {
      id: {
        allowNull: false,
        autoIncrement: true, // 自增
        primaryKey: true, // 主键
        type: Sequelize.INTEGER(11).UNSIGNED, // 11位无符号整数
      },
      code: {
        type: Sequelize.STRING(60),
        allowNull: false,
        defaultValue: '',
        comment: '验证码',
      },
      target: {
        type: Sequelize.STRING(60),
        allowNull: false,
        defaultValue: '',
        comment: '验证码接受者',
      },
      available: {
        type: Sequelize.TINYINT(1), // 1位无符号整数,长度为 1 的 TINYINT 类型,只能是0或者1
        allowNull: false,
        defaultValue: 1,
        comment: '是否可用.1为true,0为false',
      },
      expiration_time: {
        type: Sequelize.DATE,
        allowNull: false,
        comment: '过期时间',
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('verification_code');
  }
};