module.exports = {
  users: ctx => {
    ctx.body = {
      status: 200,
      message: '请先登录！',
      data: {}
    }
  },
  login: ctx => {
    console.log(ctx.request.body)
    ctx.body = {
      status: 200,
      message: '接收到登录请求',
      data: {}
    }
  }
}