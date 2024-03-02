import config from "./config.js"

export const refresh = ({ res, token }) => {
  res.cookie("authToken", token, {
    maxAge: 1000 * 86400 * config.expiryDays, // milliseconds
    httpOnly: true,
    secure: config.cookieSecure,
    ...config.cookieOverrides,
  })
}
