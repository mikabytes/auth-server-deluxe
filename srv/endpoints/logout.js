import config from "../config.js"

export default (req, res) => {
  const options = {}
  if (config.cookieOverrides?.path) {
    config.options.path = config.cookieOverrides.path
  }
  if (config.cookieOverrides?.domain) {
    options.domain = config.cookieOverrides.domain
  }
  res.clearCookie("authToken", options)
  res.sendStatus(200)
}
