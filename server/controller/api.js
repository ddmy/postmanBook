const db = require('../config/db')
module.exports = {
  users: ctx => {
    ctx.body = {
      status: 200,
      message: '请先登录！',
      data: {}
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
      ctx.session[result[0].uid] = result[0]
      res = {
        status: 200,
        message: '登录成功!',
        data: result[0]
      }
    }
    ctx.body = res
  }
}