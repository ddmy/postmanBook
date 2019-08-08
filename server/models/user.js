const db = require('../config/db')

module.exports = {
  login: async ctx => {
    let { username } = ctx.request.body
    let sql = `SELECT * FROM users WHERE username = '${username}'`
    const result = await db.readMysql(sql)
    return result
  }
}