'use strict';

const {
    id,
    name
} = {
    id: { type: 'number', required: true, description: 'id' },
    name: {
        type: 'string',
        required: true,
        min: 1,
        max: 50,
        description: '角色姓名',
    },
}

module.exports = {
    roleId: {
        id
    },
    rolePostBodyReq: {
        name
    },
    roleBodyReq: {
        id,
        name
    },
    rolePutBodyReq: {
        id,
        name
    },
  roleDelBodyReq: {
    ids: {
      type: 'array',
      required: true,
      itemType: 'number',
      description: 'ids',
      example: [1, 2],
    },
  },
};
