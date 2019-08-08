const db = require('../config/db')
const record = require('../models/record')
module.exports = {
  users: ctx => {
    ctx.body = {
      status: 200,
      message: '',
      data: ctx.session.uid
    }
  },
  login: async ctx => {
    let { username, password } = ctx.request.body
    let sql = `SELECT * FROM users WHERE username = '${username}'`
    const result = await db.readMysql(sql)
    let res = {}
    if (!result[0] || password !== result[0].password) {
      res = {
        status: 401,
        message: '账号或密码错误!',
        data: {}
      }
    } else {
      ctx.session.uid = result[0]
      res = {
        status: 200,
        message: '登录成功!',
        data: result[0]
      }
    }
    ctx.body = res
  },
  logout: async ctx => {
    ctx.session = null
    ctx.body = {
      status: 200,
      message: '退出成功!',
      data: {}
    }
  },
  couriersList: async ctx => {
    let sql = 'SELECT * FROM couriers WHERE is_del != 1'
    const result = await db.readMysql(sql)
    let res = {
      status: 200,
      message: '',
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
        message: '添加成功',
        data: {}
      }
    } else {
      ctx.body = {
        status: 500,
        message: '系统繁忙,请稍后再试!',
        data: {}
      }
    }
  }
}