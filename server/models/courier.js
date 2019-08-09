const db = require("../config/db")

module.exports = {
  couriersList: async ctx => {
    let sql = "SELECT * FROM couriers WHERE is_del != 1"
    const result = await db.readMysql(sql)
    return result
  },
  history: async ctx => {
    let { uid } = ctx.session.uid
    let sql = `SELECT a.*, b.courier_name FROM record a LEFT JOIN couriers b ON a.courier_id = b.courier_id WHERE a.user_id = ${uid}`
    const result = await db.readMysql(sql)
    return result
  }
}
