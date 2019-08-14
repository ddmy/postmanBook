const db = require("../config/db")

module.exports = {
  couriersList: async ctx => {
    let sql = "SELECT * FROM couriers WHERE is_del != 1"
    const result = await db.readMysql(sql)
    return result
  },
  history: async ctx => {
    let { uid } = ctx.session.uid
    let { page = 1, pageSize = 10 } = ctx.request.body
    let totalSql = `SELECT a.*, b.courier_name FROM record a LEFT JOIN couriers b ON a.courier_id = b.courier_id WHERE a.user_id =${uid}`
    let total = await db.readMysql(totalSql)
    let sql = `SELECT a.*, b.courier_name FROM record a LEFT JOIN couriers b ON a.courier_id = b.courier_id WHERE a.user_id =${uid} ORDER BY time DESC LIMIT ${(page -
      1) *
      pageSize}, ${pageSize}`
    const result = await db.readMysql(sql)
    return {
      list: result,
      // total: Math.ceil(total / pageSize),
      total: total.length || 0,
      page,
      pageSize
    }
  },
  deleteRecord: async ctx => {
    let recordId = ctx.params.recordId
    let sql = `DELETE FROM record WHERE record_id = '${recordId}'`
    const result = await db.deleteMysql(sql)
    return result
  }
}
