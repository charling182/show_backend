'use strict';

const { Model } = require('sequelize');

module.exports = app => {
  class Configuration extends Model {}

  Configuration.init(
    {
      id: {
        type: app.Sequelize.INTEGER(11).UNSIGNED,
        autoIncrement: true,
        primaryKey: true,
      },
      rsa_public_key: {
        type: app.Sequelize.TEXT,
        allowNull: false,
      },
      rsa_private_key: {
        type: app.Sequelize.TEXT,
        allowNull: false,
      },
      deleted_at: {
        allowNull: false,
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
      tableName: 'configuration',
      paranoid: true,
      charset: 'utf8mb4',
      collate: 'utf8mb4_unicode_ci',
    }
  );

  return Configuration;
};

