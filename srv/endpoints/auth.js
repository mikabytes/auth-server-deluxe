import { sign } from "../jwt.js"
import { refresh } from "../cookie.js"

// endpoint called by NGINX sub request
// expect JWT in cookie 'authToken'
export const get = (req, res, next) => {
  // parameters from original client request
  // these could be used for validating request
  const requestUri = req.headers["x-original-uri"]
  const remoteAddr = req.headers["x-original-remote-addr"]
  const host = req.headers["x-original-host"]

  const uri = `${host}/${requestUri}`

  console.log(
    `origin: ${uri}   remoteAddr: ${remoteAddr}   loggedIn: ${!!req.userId}`
  )

  if (req.userId) {
    // user is already authenticated, refresh cookie

    const token = sign({ userId: req.userId })
    refresh({ res, token })

    return res.sendStatus(200)
  } else {
    // not authenticated
    return res.sendStatus(401)
  }
}
