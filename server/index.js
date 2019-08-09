const Koa = require("koa")
const consola = require("consola")
const { Nuxt, Builder } = require("nuxt")
const bodyParser = require("koa-bodyparser")
const Router = require("koa-router")
const session = require("koa-session")
const routerConfig = require("./router/")
const isLogin = require("./middleware/isLogin")

const app = new Koa()
const router = new Router()

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js")
config.dev = app.env !== "production"

app.keys = ["user login"]
const CONFIG = {
  key: "koa:sess",
  maxAge: 7200000,
  autoCommit: true,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: false,
  renew: false
}

async function start() {
  // Instantiate nuxt.js
  const nuxt = new Nuxt(config)

  const {
    host = process.env.HOST || "127.0.0.1",
    port = process.env.PORT || 3000
  } = nuxt.options.server

  // Build in development
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  } else {
    await nuxt.ready()
  }

  app.use(isLogin)

  app.use(session(CONFIG, app))

  app.use(bodyParser())
  routerConfig(router, nuxt)
  app.use(router.routes())
  app.use(router.allowedMethods())

  app.listen(port, host)
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  })
}

start()
