const api = require("../controller/api.js")

module.exports = (router, nuxt) => {
  router.get(/^\/(?!api\/)(.*)$/, ctx => {
    ctx.status = 200
    ctx.respond = false // Bypass Koa's built-in response handling
    ctx.req.ctx = ctx // This might be useful later on, e.g. in nuxtServerInit or with nuxt-stash
    nuxt.render(ctx.req, ctx.res)
  })

  router.get("/api/user", api.users)
  router.post("/api/login", api.login)
  router.post("/api/logout", api.logout)
  router.post("/api/couriers/list", api.couriersList)
  router.post("/api/couriers/record", api.record)
  router.post("/api/couriers/history", api.history)
}
