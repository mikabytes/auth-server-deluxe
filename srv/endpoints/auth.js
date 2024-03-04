import { refresh } from "../cookie.js"
import { sign } from "../jwt.js"
import { get as getUser } from "../db/user.js"

// endpoint called by NGINX sub request
// expect JWT in cookie 'authToken'
export const get = async (req, res, next) => {
  // parameters from original client request
  // these could be used for validating request
  const url = req.headers["x-original-url"]
  const ip = req.headers["x-real-ip"]

  if (!req.userId) {
    // not authenticated
    return res.sendStatus(401)
  }

  const user = await getUser(req.userId)
  console.log(user)

  if (!user.resources.find((it) => it.regex.test(url))) {
    return res.sendStatus(401)
  }

  const token = sign({ userId: req.userId })
  refresh({ res, token })

  return res.sendStatus(200)
}
