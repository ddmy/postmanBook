const db = require('../config/db')
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
  }
}