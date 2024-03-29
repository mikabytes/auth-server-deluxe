import cookieParser from "cookie-parser"
import express from "express"
import nocache from "nocache"

import { verify } from "./jwt.js"
import apiLimiter from "./apiLimiter.js"
import * as auth from "./endpoints/auth.js"
import config from "./config.js"
import login from "./endpoints/login.js"
import logout from "./endpoints/logout.js"
import * as user from "./endpoints/user.js"
import * as resource from "./endpoints/resource.js"

import chalk from "chalk"

const app = express()

app.use(logger)

app.use(express.static(`public`))
app.use(cookieParser())
app.use(express.json())
app.use(nocache())
app.use(verify)

app.get(`/auth`, auth.get)

app.get(`/api/user`, user.get)
app.delete(`/api/user/:userId`, user.remove)
app.put(`/api/user/:userId`, user.update)
app.get(`/api/users`, user.getAll)
app.post(`/api/users`, user.create)
app.post(`/api/users`, user.create)

app.post(`/api/login`, apiLimiter, login)
app.post(`/api/logout`, logout)

app.get(`/api/resources`, resource.getAll)
app.get(`/api/resource/:resourceId`, resource.get)
app.post(`/api/resources`, resource.create)
app.delete(`/api/resource/:resourceId`, resource.remove)
app.put(`/api/resource/:resourceId`, resource.update)

// default 404
app.use((req, res, next) => {
  res.status(404).send(`No such page`)
  next()
})

app.listen(config.port, () =>
  console.log(`Listening at http://localhost:${config.port}`)
)

function logger(req, res, next) {
  const url = req.headers["x-original-url"] || req.originalUrl
  const ip = req.headers["x-real-ip"] || req.ip

  const startTime = performance.now()

  res.on("finish", () => {
    console.log(
      `${new Date().toISOString()} ${chalk[req.statusCode < 400 ? `green` : `red`](res.statusCode)} ${req.userId ? req.userId : `FAILED`} ${ip} ${url} ${("" + (performance.now() - startTime)).slice(0, 4)}ms`
    )
  })

  next()
}
