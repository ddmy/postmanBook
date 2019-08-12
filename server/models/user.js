const db = require("../config/db")
const GetStsToken = require("../config/sts")

module.exports = {
  login: async ctx => {
    let { username } = ctx.request.body
    let sql = `SELECT * FROM users WHERE username = '${username}'`
    const result = await db.readMysql(sql)
    return result
  },
  sts: async ctx => {
    const result = await GetStsToken.getToken()
    return result
  }
}
