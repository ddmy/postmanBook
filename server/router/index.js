const api = require('../controller/api.js')

module.exports = (router, nuxt) => {
  router.get(/^\/(?!api\/)(.*)$/, ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })
  
  router.get('/api/users', api.users)
}