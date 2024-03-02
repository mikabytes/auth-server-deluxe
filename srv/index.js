import express from "express"
import cookieParser from "cookie-parser"
import morgan from "morgan"
import nocache from "nocache"
import apiLimiter from "./apiLimiter.js"
import config from "./config.js"
import { verify } from "./jwt.js"
import * as cookie from "./cookie.js"
import * as user from "./endpoints/user.js"
import * as auth from "./endpoints/auth.js"
import login from "./endpoints/login.js"
import logout from "./endpoints/logout.js"

const app = express()

app.use(morgan(`dev`))
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
app.post(`/api/login`, apiLimiter, login)
app.post(`/api/logout`, logout)

// default 404
app.use((req, res, next) => {
  res.status(404).send(`No such page`)
})

app.listen(config.port, () =>
  console.log(`Listening at http://localhost:${config.port}`)
)
