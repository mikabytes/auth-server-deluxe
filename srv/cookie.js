import config from "./config.js"
import psl from "psl"

export const refresh = ({ req, res, token }) => {
  const domain = getBaseDomain(req)

  res.cookie("authToken", token, {
    maxAge: 1000 * 86400 * config.expiryDays, // milliseconds
    httpOnly: true,
    secure: config.cookieSecure,
    domain,
    ...config.cookieOverrides,
  })
}

export function getBaseDomain(req) {
  let host = req.headers["x-forwarded-host"] || req.headers.host
  if (!host) return null
  host = host.split(",")[0].trim().replace(/:\d+$/, "")
  const parsed = psl.parse(host)
  return parsed.domain || host // falls back if PSL lookup fails
}
