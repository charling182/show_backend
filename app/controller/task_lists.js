'use strict';

const Controller = require('egg').Controller;
const { Op } = require('sequelize');

/**
 * @controller 任务列表 task_list
 */

class RoleController extends Controller {
  /**
   * @apikey
   * @summary 获取 任务列表
   * @description 获取 任务列表
   * @request query string name task_list名
   * @request query number limit limit
   * @request query number offset offset
   * @router get /backend/task_lists/list
   */
  async findAll() {
    const { ctx, service, app: { lodash } } = this;
    // get请求参数转为数字类型
    ctx.helper.tools.queryParseInt(ctx.query, ['limit', 'offset', 'project_id', 'is_done']);
    const taskRules = {
      executor_ids: {
        type: 'array',
        required: false,
        itemType: 'number',
        description: '执行者IDs',
        example: [1, 2],
      },
      creator_ids: {
        type: 'array',
        required: false,
        itemType: 'number',
        description: '创建者IDs',
        example: [1, 2],
      },
      task_priority_ids: {
        type: 'array',
        required: false,
        itemType: 'number',
        description: '优先级IDs',
        example: [1, 2],
      },
      task_state_ids: {
        type: 'array',
        required: false,
        itemType: 'number',
        description: '执行状态IDs',
        example: [1, 2],
      },
    };
    const queries = Object.assign({ taskWhere: {}, listWhere: {} }, ctx.query);
    for (const key in queries) {
      if (queries[key] === undefined) {
        delete queries[key];
      }
    }
    for (const key in taskRules) {
      const data = ctx.queries[key];
      if (data) {
        queries[key] = lodash.isArray(data) ? lodash.map(data, lodash.parseInt) : data;
      }
    }
    if (queries.project_id) queries.listWhere.project_id = queries.project_id;
    if ([1, 0].includes(queries.is_done)) queries.taskWhere.is_done = queries.is_done;
    // 提供了一个空的 AND 条件（即 [Symbol(and)]: []），那么查询将不会返回任何结果，因为没有任何记录能满足一个空的 OR 条件
    if (queries.name || queries.executor_ids || queries.creator_ids || queries.task_priority_ids || queries.task_state_ids) {
      !queries.taskWhere[Op.and] ? (queries.taskWhere[Op.and] = []) : null;
      queries.name ? queries.taskWhere[Op.and].push({ name: { [Op.like]: `%${queries.name}%` } }) : null;
      queries.executor_ids ? queries.taskWhere[Op.and].push({ executor_id: queries.executor_ids }) : null;
      queries.creator_ids ? queries.taskWhere[Op.and].push({ creator_id: queries.creator_ids }) : null;
      queries.task_priority_ids ? queries.taskWhere[Op.and].push({ task_priority_id: queries.task_priority_ids }) : null;
      queries.task_state_ids ? queries.taskWhere[Op.and].push({ task_state_id: queries.task_state_ids }) : null;
    }
    const res = await service.taskLists.findAll(queries);
    if (res === false) return;
    ctx.helper.body.SUCCESS({ ctx, res });
  }

  /**
   * @apikey
   * @summary 获取某个 任务列表
   * @description 获取某个 任务列表
   * @router get /backend/task_lists
   * @request query number *id eg:1 task_listID
   */
  async findOne() {
    const { ctx, service } = this;
    ctx.helper.tools.queryParseInt(ctx.query, ['id']);
    ctx.validate(ctx.rule.task_listId, ctx.query);
    const res = await service.taskLists.findOne(ctx.query.id);
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 创建 任务列表
   * @description 创建 任务列表
   * @router post /backend/task_lists
   * @request body task_listBodyReq
   */
  async create() {
    const ctx = this.ctx;
    ctx.validate(ctx.rule.task_listBodyReq, ctx.request.body);
    const res = await ctx.service.taskLists.create(ctx.request.body);
    if (res === false) return;
    ctx.helper.body.CREATED_UPDATE({ ctx });
  }

  /**
   * @apikey
   * @summary 更新 任务列表
   * @description 更新 任务列表
   * @router put /backend/task_lists
   * @request body task_listPutBodyReq
   */
  async update() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.task_listPutBodyReq, ctx.request.body);
    const res = await service.taskLists.update(ctx.request.body);
    if (res === false) return;
    res && res[1] && res[1].length ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 批量删除 任务列表
   * @description 批量删除 任务列表
   * @router delete /backend/task_lists
   * @request body task_listDelBodyReq
   */
  async destroy() {
    const { ctx, service } = this;
    ctx.validate(ctx.rule.task_listDelBodyReq, ctx.request.body);
    const res = await service.taskLists.destroy(ctx.request.body);
    if (res === false) return;
    res ? ctx.helper.body.SUCCESS({ ctx, res }) : ctx.helper.body.NOT_FOUND({ ctx });
  }

  /**
   * @apikey
   * @summary 更新任务列表排序
   * @description 更新任务列表排序
   * @router put /backend/task_lists/sort
   * @request body taskPutBodyReq
   */
  async sort() {
    const { ctx, service } = this;
    const params = {
      id: {
        type: 'number',
        required: true,
      },
      preId: {
        type: 'number',
        required: false,
      },
      nextId: {
        type: 'number',
        required: false,
      },
    };
    ctx.validate(params, ctx.request.body);
    const { preId, nextId } = ctx.request.body;
    if (!(preId || nextId)) {
      ctx.helper.body.VALIDATION_FAILED({
        ctx,
        res: {
          error: 'Validation Failed',
          detail: [
            {
              message: 'required',
              field: 'preId or nextId',
              code: 'missing_field, nextId.Preid or preId must have one',
            },
          ],
        },
      });
      return;
    }
    const res = await service.taskLists.sort(ctx.request.body);
    if (res === false) return;
    res && res[1] && res[1].length ? ctx.helper.body.CREATED_UPDATE({ ctx }) : ctx.helper.body.NOT_FOUND({ ctx });
  }
}

module.exports = RoleController;
