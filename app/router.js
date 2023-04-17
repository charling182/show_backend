'use strict';
module.exports = app => {
  const { router, controller } = app;
  router.get('/backend/user', controller.user.index);
};
