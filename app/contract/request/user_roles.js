'use strict';

const {

} = {
    id: { 
        type: 'number', 
        required: true, 
        description: 'id' 
    },
    user_id: {
        type: 'number',
        required: true,
        min: 1,
        example: 1,
        description: '用户ID',
    },
    role_id: {
        type: 'number',
        required: true,
        min: 1,
        example: 1,
        description: '角色ID',
    },
}

module.exports = {
    user_roleBodyReq: {
        user_id,
        role_id,
    },
    user_roleId: {
        id
    },
    user_rolePutBodyReq: {
        id,
        user_id,
        role_id,
    },
    user_roleDelBodyReq: {
        ids: {
        type: 'array',
        required: true,
        itemType: 'number',
        description: 'ids',
        example: [1, 2],
        },
    },
};
