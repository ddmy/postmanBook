const db = require("../config/db")

module.exports = {
  record: async ctx => {
    let {
      couriersName: couriersId,
      courierSize,
      upload = [],
      recordId = null
    } = ctx.request.body
    let { uid } = ctx.session.uid
    let recorId = `R_${uid}_${getTime()}`
    // let time = new Date().toLocaleString()
    let sql = ""
    if (!Array.isArray(upload)) {
      upload = [upload]
    }
    let result
    if (recordId) {
      sql = `UPDATE record SET courier_id=${couriersId}, size=${courierSize}, image='${JSON.stringify(
        upload
      )}' WHERE record_id='${recordId}'`
      result = await db.updateMysql(sql).catch(err => console.log(err))
    } else {
      sql = `INSERT INTO record ( record_id, courier_id, user_id, size, time, image ) VALUES (?, ?, ?, ?, NOW(), ?)`
      result = await db
        .writeMySql(sql, [
          recorId,
          couriersId,
          uid,
          courierSize,
          JSON.stringify(upload)
        ])
        .catch(err => console.log(err))
    }
    return result
  }
}

// 时间戳
function getTime() {
  let time = new Date()
  let str =
    time.getFullYear() +
    getLenStr(time.getMonth()) +
    getLenStr(time.getDate()) +
    getLenStr(time.getHours()) +
    getLenStr(time.getMinutes()) +
    getLenStr(time.getSeconds()) +
    getLenStr(time.getMilliseconds(), 3)
  time = null
  return str
}
// 获取指定长度字符串
function getLenStr(str, len = 2, fill = "0", direction = "padStart") {
  str = String(str)
  fill = String(fill)
  if (!str.padStart) {
    throw new Error("getLenStr params error!")
  }
  return str[direction](len, fill)
}
