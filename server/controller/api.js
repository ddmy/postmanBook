const user = require("../models/user")
const courier = require("../models/courier")
const record = require("../models/record")
module.exports = {
  users: ctx => {
    ctx.body = {
      status: 200,
      message: "",
      data: ctx.session.uid
    }
  },
  login: async ctx => {
    const result = await user.login(ctx).catch(err => console.log(err))
    let { password } = ctx.request.body
    let res = {}
    if (!result[0] || password !== result[0].password) {
      res = {
        status: 401,
        message: "账号或密码错误!",
        data: {}
      }
    } else {
      ctx.session.uid = result[0]
      res = {
        status: 200,
        message: "登录成功!",
        data: result[0]
      }
    }
    ctx.body = res
  },
  logout: async ctx => {
    ctx.session = null
    ctx.body = {
      status: 200,
      message: "退出成功!",
      data: {}
    }
  },
  couriersList: async ctx => {
    const result = await courier.couriersList().catch(err => console.log(err))
    let res = {
      status: 200,
      message: "",
      data: {
        list: result
      }
    }
    ctx.body = res
  },
  record: async ctx => {
    const result = await record.record(ctx)
    if (result) {
      ctx.body = {
        status: 200,
        message: "添加成功",
        data: {}
      }
    } else {
      ctx.body = {
        status: 500,
        message: "系统繁忙,请稍后再试!",
        data: {}
      }
    }
  },
  history: async ctx => {
    const result = await courier.history(ctx).catch(err => console.log(err))
    ctx.body = {
      status: 200,
      message: "",
      data: { ...result }
    }
  },
  sts: async ctx => {
    const result = await user.sts(ctx).catch(err => console.log(err))
    if (result) {
      ctx.body = {
        status: 200,
        message: "",
        data: result
      }
    } else {
      ctx.body = {
        status: 402,
        message: "获取权限失败![N002]",
        data: {}
      }
    }
  },
  deleteRecord: async ctx => {
    let recordId = ctx.params.recordId
    const result = await courier.deleteRecord(ctx)
    if (result) {
      ctx.body = {
        status: 200,
        message: "已删除!",
        data: { recordId }
      }
    } else {
      ctx.body = {
        status: 403,
        message: "网路异常!请稍后再试",
        data: {}
      }
    }
  },
  detail: async ctx => {
    const result = await courier.detail(ctx)
    if (result) {
      ctx.body = {
        status: 200,
        message: "",
        data: { ...result[0] }
      }
    } else {
      ctx.body = {
        status: 403,
        message: "获取模板信息失败，请稍后再试!",
        data: {}
      }
    }
  },
  search: async ctx => {
    const result = await courier.search(ctx).catch(err => console.log(err))
    if (result) {
      ctx.body = {
        status: 200,
        message: "",
        data: { list: result }
      }
    }
  },
  couriersPrice: async ctx => {
    const result = await courier.price(ctx).catch(err => console.log(err))
    if (result) {
      ctx.body = {
        status: 200,
        message: "",
        data: {
          priceList: result
        }
      }
    } else {
      ctx.body = {
        status: 403,
        message: "获取价格信息失败!",
        data: {}
      }
    }
  }
}
