import jwt from "jsonwebtoken"
import config from "./config.js"

export const verify = (req, res, next) => {
  const token = req.cookies.authToken

  if (!token) {
    return next()
  }

  jwt.verify(token, config.tokenSecret, (err, decoded) => {
    if (err) {
      // e.g malformed token, bad signature etc - clear the cookie also
      console.log(err)
      res.clearCookie("authToken")
      return res.status(403).send(err)
    }

    req.userId = decoded.userId || null
    next()
  })
}

export const sign = ({ userId }) =>
  jwt.sign({ userId }, config.tokenSecret, {
    expiresIn: `${config.expiryDays}d`,
  })
