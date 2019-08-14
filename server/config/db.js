const mysql = require("mysql")

class db {
  constructor() {
    this.connection = mysql.createConnection({
      host: "cdb-38vry0rm.bj.tencentcdb.com",
      user: "root",
      password: "Cdd841312998",
      port: "10136",
      database: "courier"
    })
    db.connection(this.connection)
    // 查询
    this.readMysql = sql => {
      return new Promise((resolve, reject) => {
        this.connection.query(sql, (error, results, fields) => {
          if (error) return reject(error)
          resolve(JSON.parse(JSON.stringify(results)))
        })
      })
    }
    // 写入
    this.writeMySql = (sql, arr) => {
      return new Promise((resolve, reject) => {
        this.connection.query(sql, arr, (err, result) => {
          if (err) return reject(err)
          resolve(JSON.parse(JSON.stringify(result)))
        })
      })
    }
    this.deleteMysql = this.readMysql
    this.updateMysql = this.readMysql
  }
  static async connection(db) {
    return new Promise((resolve, reject) => {
      db.connect(err => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }
  static async end(db) {
    return new Promise((resolve, reject) => {
      db.end(err => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }
}

module.exports = new db()
