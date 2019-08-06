// 目前这里存放不需要登录就可以请求的接口
// 有一些接口是带有参数的，正确的做法应该是封装一个方法，来判断目前的url是否包含其中！
const notNeedLoginApi = [
  '/api/login'
]

module.exports = async (ctx, next) => {
  let url = ctx.request.url
  if (/^\/api/.test(url) && !notNeedLoginApi.includes(url) && !ctx.session.uid) {
    ctx.body = {
      status: 200,
      message: '请先登录！',
      data: {}
    }
  }
  await next()
}