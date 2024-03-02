import { sign as jwt } from "../jwt.js"
import { refresh } from "../cookie.js"

// endpoint called by NGINX sub request
// expect JWT in cookie 'authToken'
export const get = (req, res, next) => {
  // parameters from original client request
  // these could be used for validating request
  // const requestUri = req.headers["x-original-uri"]
  // const remoteAddr = req.headers["x-original-remote-addr"]
  // const host = req.headers["x-original-host"]

  if (req.user) {
    // user is already authenticated, refresh cookie

    const token = sign({ user: req.user })
    refresh({ res, token })

    return res.sendStatus(200)
  } else {
    // not authenticated
    return res.sendStatus(401)
  }
}
