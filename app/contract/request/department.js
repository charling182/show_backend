'use strict';

const {
  id,
  name,
  owner_id,
  parent_id,
  sort,
  ids,
} = {
  id: { type: 'number' | 'string', required: true, description: 'id' },
  name: {
    type: 'string',
    required: true,
    max: 60,
    trim: true,
    example: '研发部',
    description: '部门名称',
  },
  owner_id: {
    type: 'number',
    required: false,
    min: 0,
    example: 0,
    description: '拥有者ID',
  },
  parent_id: {
    type: 'number',
    required: true,
    min: 0,
    example: 0,
    description: '父ID',
  },
  sort: {
    type: 'number',
    required: false,
    max: 999999999,
    example: 0,
    description: '排序，越大越靠前',
  },
  ids: {
    type: 'array',
    required: true,
    itemType: 'number',
    description: 'ids',
    example: [ 1, 2 ],
  },
};

module.exports = {
    departmentId: {
        id,
    },
  departmentPutBodyReq: {
    id,
    name,
    owner_id,
    parent_id,
    sort,
  },
  departmentDelBodyReq: {
    ids,
  },
  departmentPostBodyReq: {
    name,
    owner_id,
    parent_id,
    sort,
  }
};
