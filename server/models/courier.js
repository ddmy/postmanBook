const db = require('../config/db')

module.exports = {
  couriersList: async ctx => {
    let sql = 'SELECT * FROM couriers WHERE is_del != 1'
    const result = await db.readMysql(sql)
    return result
  }
}