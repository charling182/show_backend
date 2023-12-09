'use strict';
module.exports = app => {
  const Sequelize = app.Sequelize;

  const project = app.model.define(
    'projects',
    {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true },
      name: Sequelize.STRING(255),
      parent_id: Sequelize.INTEGER(11),
      manager_id: Sequelize.INTEGER(11),
      project_template_id: Sequelize.INTEGER(11),
      progress: Sequelize.INTEGER(11),
      cover: Sequelize.STRING(255),
      is_recycle: Sequelize.TINYINT(1),
      is_archived: Sequelize.TINYINT(1),
      is_private: Sequelize.TINYINT(1),
      is_auto_progress: Sequelize.TINYINT(1),
      state: Sequelize.TINYINT(1),
      intro: Sequelize.STRING(255),
    },
    {}
  );

  project.addHook('afterCreate', async (project, options) => {
    // // 这里通过socket去更新项目信息没有必要,虽然在多页面的情况下会有有时但是这里不是消息菜单,不需要实时更新
    // const ctx = await app.createAnonymousContext();
    // // 发送socket消息
    // const { id, manager_id } = project;
    // const creator = await ctx.model.User.findOne({ where: { id: manager_id } });
    // const newProject = Object.assign(
    //   {
    //     collector: [],
    //     parent_id: 0,
    //     progress: 0,
    //     cover: '',
    //     is_private: 1,
    //     is_auto_progress: 0,
    //     is_recycle: 0,
    //     is_archived: 0,
    //     state: 1,
    //     intro: '',
    //     creator,
    //   },
    //   project.dataValues
    // );
    // const nsp = app.io.of('/');
    // const roomName = `${app.config.socketProjectRoomNamePrefix}${id}`;
    // const rex = new RegExp(`^${manager_id}_.*`);
    // nsp.adapter.clients((err, clients) => {
    //   if (err) {
    //     app.logger.errorAndSentry(err);
    //     return;
    //   }
    //   clients.forEach(clientId => {
    //     // 正则userID_uuid，给同一个用户多个socket分别发送消息
    //     if (rex.test(clientId)) {
    //       try {
    //         const socket = nsp.sockets[clientId];
    //         // const socket = nsp.to(clientId);
    //         // 将创建者加入新创建的项目room
    //         // 在 Socket.IO 中，一个连接（客户端）可以同时加入多个房间，
    //         // 这使得连接可以同时参与多个房间的消息传递和广播。
    //         // 连接加入多个房间后，可以通过向特定房间发送消息或进行广播，
    //         // 实现对多个房间中的客户端进行定向的消息传递。
    //         socket &&
    //           socket.join(roomName, () => {
    //             // ctx.helper.sendMessageToSocket(manager_id, newProject, 'create:project');
    //           });
    //       } catch (e) {
    //         // app.logger.errorAndSentry(e);
    //       }
    //     }
    //   });
    // });
  });

  project.addHook('afterUpdate', async (project, options) => {
    const ctx = await app.createAnonymousContext();
    // ctx.helper.sendSocketToClientOfRoom(project, 'update:project', project.id);
  });
  project.addHook('afterDestroy', async (project, options) => {
    const ctx = await app.createAnonymousContext();
    // ctx.helper.sendSocketToClientOfRoom(project, 'delete:project', project.id);
  });

  project.associate = function (models) {
    // associations can be defined here
    project.belongsTo(app.model.User, { foreignKey: 'manager_id', targetKey: 'id', as: 'creator' });

    app.model.Projects.belongsToMany(app.model.User, {
      through: app.model.UserProjects,
      foreignKey: 'project_id',
      otherKey: 'user_id',
      as: 'member',
    });
    app.model.Projects.belongsToMany(app.model.User, {
      through: app.model.UserProjectCollects,
      foreignKey: 'project_id',
      otherKey: 'user_id',
      as: 'collector',
    });
  };
  return project;
};
