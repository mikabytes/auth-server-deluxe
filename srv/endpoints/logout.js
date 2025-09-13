import config from "../config.js"
import { getBaseDomain } from "../cookie.js"

export default (req, res) => {
  const options = {}
  config.domain = getBaseDomain(req)
  if (config.cookieOverrides?.path) {
    config.options.path = config.cookieOverrides.path
  }
  if (config.cookieOverrides?.domain) {
    options.domain = config.cookieOverrides.domain
  }
  res.clearCookie("authToken", options)
  res.sendStatus(200)
}
