export default {
  getCookie (name) {
    var reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)')
    var arr = document.cookie.match(reg)
    if (arr) {
      if (typeof unescape(arr[2]) === 'string' && unescape(arr[2]) === 'null') {
        return JSON.parse(unescape(arr[2]))
      }
      return unescape(arr[2])
    }
    return null
  },
  clearCookie () {
    var keys = document.cookie.match(/[^ =;]+(?==)/g)
    var exclude = []
    if (keys) {
      for (var i = keys.length; i--;) {
        if (exclude.includes(keys[i])) {
          continue
        }
        document.cookie = keys[i] + '=;expires=' + new Date(0).toUTCString() + ';path=/'
      }
    }
  },

  // 设置过期时间，以毫秒为单位
  setCookie (name, value, hours = 72 * 60 * 60 * 1000, path = '/', domain = '') {
    var exp = new Date()
    exp.setTime(exp.getTime() + hours)
    document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=' + path + (domain ? `;domain=${domain}` : '')
  },
  // 时间戳
  getTime () {
    let time = new Date()
    let str = time.getFullYear() +
    this.getLenStr(time.getMonth()) +
    this.getLenStr(time.getDate()) +
    this.getLenStr(time.getHours()) +
    this.getLenStr(time.getMinutes()) +
    this.getLenStr(time.getSeconds()) +
    this.getLenStr(time.getMilliseconds(), 3)
    time = null
    return str
  },
  // 获取指定长度字符串
  getLenStr (str, len = 2, fill = '0', direction = 'padStart') {
    str = String(str)
    fill = String(fill)
    if (!str.padStart) {
      throw new Error('getLenStr params error!')
    }
    return str[direction](len, fill)
  }
}