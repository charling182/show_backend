'use strict';

const Service = require('egg').Service;
const { Op } = require('sequelize');
const NodeRSA = require('node-rsa');

class UserService extends Service {
  async findAll(payload) {
    const { ctx } = this;
    const { limit, offset, prop_order, order, username, email, phone, state, department_id, keyword, date_after_created, project_id } = payload;
    const where = {};
    let project_where = null;
    keyword
      ? (where[Op.or] = [{ username: { [Op.like]: `%${keyword}%` } }, { email: { [Op.like]: `%${keyword}%` } }, { phone: { [Op.like]: `%${keyword}%` } }])
      : null;
    // 创建时间大于等于date_after_created
    date_after_created ? (where[Op.and] = [{ created_at: { [Op.gte]: date_after_created } }]) : null;
    const Order = [];
    username ? (where.username = { [Op.like]: `%${username}%` }) : null;
    email ? (where.email = { [Op.like]: `%${email}%` }) : null;
    phone ? (where.phone = { [Op.like]: `%${phone}%` }) : null;
    !ctx.helper.tools.isParam(state) ? (where.state = state) : null;
    !ctx.helper.tools.isParam(department_id) ? (where.department_id =  department_id) : null;
    !ctx.helper.tools.isParam(project_id) ? (project_where = { id: project_id }) : null;
    prop_order && order ? Order.push([prop_order, order]) : null;
    // 不返回id为1的超级管理员用户
    if (where[Op.and]) {
      where[Op.and].push({ id: { [Op.ne]: 1 } });
    } else {
      where[Op.and] = [{ id: { [Op.ne]: 1 } }];
    }
    return await ctx.model.User.findAndCountAll({
      limit,
      offset,
      where,
      order: Order,
      attributes: { exclude: [ 'password', 'deleted_at' ] },
      include: [
        // {
        //   model: ctx.model.Projects,
        //   attributes: [ 'id' ],
        //   where: project_where,
        // },
        // {
        //   model: ctx.model.Roles,
        //   attributes: [ 'id', 'name' ],
        // },
        {
          model: ctx.model.Departments,
          attributes: [ 'id', 'name' ],
          as: 'department', // 别名 返回的数据是对象{department: {id: 1, name: 'xxx'}}
        },
      ],
      distinct: true,
    });
  }

  async findOne(id) {
    const { ctx } = this;
    return await ctx.model.User.findOne({
      where: { id },
      attributes: { exclude: ['password', 'deleted_at'] },
      include: [
        {
          model: ctx.model.Departments,
          attributes: ['id', 'name'],
          as: 'department',
        },
      ],
    });
  }
  /**
   *  创建用户
   */
  async create(payload) {
    const { ctx, app } = this;
    const { email, code, username } = payload;
    const current_time = app.dayjs()
      .format('YYYY-MM-DD hh:mm:ss');
    // 验证码 验证
    const res = await ctx.model.VerificationCode.findOne({
      where: {
        target: email,
        code,
        available: 1,
        expiration_time: { [Op.gt]: current_time },
      },
    });
    if (res) {
      const resExistsUsername = await this.existsUserUniqueFields({ username });
      if (resExistsUsername) {
        return {
          __code_wrong: 40001,
          message: '用户名已存在',
        };
      }
      const resExistsEmail = await this.existsUserUniqueFields({ email });
      if (resExistsEmail) {
        return {
          __code_wrong: 40002,
          message: '邮箱已存在',
        };
      }
      payload = Object.assign(payload, await ctx.helper.tools.saltPassword(payload.password));
      payload.password += payload.salt;
      // 此处执行多个操作，需要使用事务
      try {
        const res_user = await ctx.model.User.create(payload);
        // 所有相应验证码状态都变更为false
        await ctx.model.VerificationCode.update(
          { available: 0 },
          {
            where: { target: email },
          }
        );
        return res_user;
      } catch (e) {
        return {
          __code_wrong: 40003,
          message: '用户创建失败',
        };
      }
    }
    return {
      __code_wrong: 40000,
      message: '验证码错误或已使用过或已过期',
    };
  }

  async update(payload) {
    const { ctx } = this;
    return await ctx.model.User.update(payload, { where: { id: payload.id } });
  }

  async destroy(payload) {
    const { ctx } = this;
    // 不允许删除id为1的超级管理员用户
    if (payload.ids.includes(1)) {
      return {
        __code_wrong: 40005,
        message: '不允许删除超级管理员用户',
      };
    }
    // user表开启了软删除
    return await ctx.model.User.destroy({ where: { id: payload.ids } });
  }

  async login(payload) {
    const { ctx } = this;
    const user = await ctx.model.User.scope('withPassword')
      .findOne({
        where: { username: payload.username },
      });
    if (!user) {
      return {
        __code_wrong: 40004,
      };
    }
    // user.dataValues 是 Sequelize 中一个实例对象的属性，用于表示该对象的所有属性和值，
    // 于一个 User 实例对象，它可能包含 id、username、password 等属性，对应的值也可以通过 dataValues 属性进行访问，如 user.dataValues.id
    const passwordData = Object.assign(payload, await ctx.helper.tools.saltPassword(payload.password, user.dataValues.password.substr(32)));
    passwordData.password += passwordData.salt;
    if (passwordData.password === user.dataValues.password) {
      return await this.loginDeal(ctx, user);
    }
    return {
      __code_wrong: 40000,
    };
  }

  /**
   * 用户信息
   * @return {Promise<*>}
   */
  async userInfo() {
    const { ctx, app } = this;

    // const res = await ctx.model.User.findOne({
    //   include: [
    //     {
    //       model: ctx.model.Roles,
    //       include: [
    //         {
    //           model: ctx.model.Permissions,
    //           attributes: [ 'id', 'url', 'action' ],
    //         },
    //       ],
    //     },
    //   ],
    //   where: { id: ctx.currentRequestData.userInfo.id },
    //   attributes: { exclude: ['password', 'deleted_at'] },
    // });
    // let arr = [];
    // res.roles.forEach(e => {
    //   e.permissions.forEach(ee => {
    //     arr.push(ee);
    //   });
    // });
    // arr = app.lodash.uniqWith(arr, (a, b) => a.id === b.id);
    // arr = arr.map(permission => `${permission.action}:${permission.url}`);
    // res.dataValues.permissions = arr || [];
    // jwt令牌中的信息在中间件的时候挂载到了ctx.currentRequestData.userInfo上
    const res = await ctx.model.User.findOne({
      where: { id: ctx.currentRequestData.userInfo.id },
      attributes: { exclude: [ 'password', 'deleted_at' ] },
    });
    return res;
  }

  /**
   * 是否存在此用户字段
   */
  async existsUserUniqueFields(payload) {
    const { ctx } = this;
    const { username, nickname, email } = payload;
    const where = {};
    where[Op.or] = [];
    username ? where[Op.or].push({ username }) : null;
    nickname ? where[Op.or].push({ nickname }) : null;
    email ? where[Op.or].push({ email }) : null;
    return await ctx.model.User.findOne({
      where,
      attributes: { exclude: [ 'password', 'deleted_at' ] },
    });
  }

  /**
   * 修改 用户密码
   */
  async updateUserPassword(payload) {
    const { ctx, app } = this;
    const { password, email, code } = payload;
    // 在启用软删除功能后，查询数据时，Sequelize 会自动将软删除的数据过滤掉，除非显式地指定查询包括软删除的数据。
    // 通过设置 paranoid 属性为 false，可以查询到软删除的数据
    // const result2 = await User.findOne({ where: { name: 'Alice' }, paranoid: false });
    const user = await ctx.model.User.findOne({
      where: {
        email,
      },
    });
    if (user) {
      const current_time = app.dayjs()
        .format('YYYY-MM-DD hh:mm:ss');
      // 验证码 验证
      const verificationCode = await ctx.model.VerificationCode.findOne({
        where: {
          target: email,
          code,
          available: 1,
          expiration_time: { [Op.gt]: current_time },
        },
      });
      if (verificationCode) {
        const password_new = await ctx.helper.tools.saltPassword(password);
        password_new.password += password_new.salt;
        const res = await ctx.model.User.update(
          { password: password_new.password },
          {
            where: {
              email,
            },
          }
        );
        // 所有相应验证码状态都变更为false
        await ctx.model.VerificationCode.update(
          { available: 0 },
          {
            where: { target: email },
          }
        );
        return res;
      }
      return {
        __code_wrong: 40000,
        message: '验证码错误或已使用过',
      };
    }
    return {
      __code_wrong: 40004,
      message: '邮箱不存在',
    };
  }

  /**
   * 登出
   */
  async logout() {
    // const { ctx, app } = this;
    // const accessToken = ctx.request.headers.authorization && ctx.request.headers.authorization.split('Bearer ')[1];
    // return await app.redis.setex(accessToken, app.config.jwt_exp, '1');
    return 'ok';
  }

  /**
   * 修改 用户所属部门
   */
  async updateUserDepartment(payload) {
    const { ctx } = this;
    const { id, department_id } = payload;
    //  如果department_id为0则设为null
    return await ctx.model.User.update({ department_id: department_id }, { where: { id } });
  }

  /**
   * 刷新accessToken
   */
  async refreshToken(payload) {
    const { ctx, app } = this;
    const { refreshToken, secret } = payload;
    try {
      const { data: currentRequestData } = await ctx.app.jwt.verify(refreshToken, ctx.app.config.jwt.secret_refresh);
      const { rsa_private_key } = await ctx.model.Configurations.findOne({
        where: { id: 1 },
      });
      const key = new NodeRSA(rsa_private_key);
      try {
        const _secret = key.decrypt(secret, 'utf8');
        if (currentRequestData.userInfo && currentRequestData.userInfo.id && currentRequestData.userInfo.id.toString() === _secret) {
          return {
            accessToken: await ctx.helper.tools.apply(ctx, currentRequestData, app.config.jwt_exp),
            refreshToken,
          };
        }
        return {
          __code_wrong: 40003,
          message: 'refreshToken与secret不匹配',
        };
      } catch (e) {
        return {
          __code_wrong: 40002,
          message: 'secret有误',
        };
      }
    } catch (e) {
      if (e.name === 'TokenExpiredError') {
        return {
          __code_wrong: 40000,
          message: '登录已过期',
        };
      }
      return {
        __code_wrong: 40001,
        message: 'refreshToken有误',
      };
    }
  }

  async githubLogin(payload) {
    const { ctx, app } = this;
    const { login, id, avatar_url, name, company, location, email } = payload;
    let user = await ctx.model.Users.findOne({
      where: {
        username: login,
        user_id_github: id,
      },
    });
    //  如果用户还没有注册，则注册
    if (!user) {
      const existUser = await ctx.model.Users.findOne({
        where: {
          username: login,
        },
      });
      if (existUser) {
        return {
          __code_wrong: 40002,
        };
      }
      const transaction = await ctx.model.transaction();
      try {
        const res_user = await ctx.model.Users.create(
          {
            username: login,
            user_id_github: id,
            nickname: name,
            avatar: avatar_url,
            company: company || '',
            city: location || '',
            password: 'password',
            email,
          },
          { transaction }
        );
        const defaultRole = await ctx.model.Roles.findOne({ where: { is_default: 1 } });
        // 分配 默认角色
        await ctx.model.UserRoles.create(
          {
            user_id: res_user.id,
            role_id: defaultRole.id,
          },
          { transaction }
        );
        await transaction.commit();
        // 完成创建重新获取一下
        user = await ctx.model.Users.findOne({
          where: {
            username: login,
            user_id_github: id,
          },
        });
      } catch (e) {
        await transaction.rollback();
        app.logger.errorAndSentry(e);
        return {
          __code_wrong: 40000,
        };
      }
    }
    return this.loginDeal(ctx, user);
  }

  /**
   * 登录用户，获取到user后处理
   */
  async loginDeal(ctx, user) {
    const { app } = ctx;
    // 账号是否被停用
    if (user.state !== 1) {
      return {
        __code_wrong: 40005,
      };
    }
    // 更新最后登录时间,update是sequelize实例的方法,更新登录时间
    user.update({
      last_login: app.dayjs()
        .format('YYYY-MM-DD HH:mm:ss'),
    });
    // currentRequestData的内容就是jwt令牌中的信息,中间件中解码的时候就能看到
    const currentRequestData = { userInfo: { id: user.id, username: user.username } };
    return user
      ? {
        accessToken: await ctx.helper.tools.apply(ctx, currentRequestData, app.config.jwt_exp),
        refreshToken: await ctx.helper.tools.apply(ctx, currentRequestData, app.config.jwt_refresh_exp, app.config.jwt.secret_refresh),
      }
      : null;
  }
}

module.exports = UserService;
