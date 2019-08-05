const mysql = require('mysql')

class db {
  constructor () {
    this.connection = mysql.createConnection({
      host: 'cdb-38vry0rm.bj.tencentcdb.com',
      user: 'root',
      password: 'Cdd841312998',
      port: '10136',
      database: 'courier'
    })
    db.connection(this.connection)
    this.readMysql = async sql => {
      return new Promise(async (resolve, reject) => {
        this.connection.query(sql, (error, results, fields) => {
          if (error) return reject(error)
          resolve(JSON.parse(JSON.stringify(results)))
        })
        // await db.end(this.connection)
      })
    }
  }
  static async connection (db) {
    return new Promise((resolve, reject) => {
      db.connect(err => {
        if (err) {
          reject(err)
        }
        resolve(true)
      })
    })
  }
  static async end (db) {
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