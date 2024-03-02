const config = {
  port: process.env.AUTH_PORT || 3000,
  tokenSecret: process.env.AUTH_TOKEN_SECRET,
  expiryDays: process.env.EXPIRY_DAYS || 7,
  cookieSecure:
    "AUTH_COOKIE_SECURE" in process.env
      ? process.env.AUTH_COOKIE_SECURE === "true"
      : true,
  cookieOverrides: {},
}

if (!config.tokenSecret) {
  console.error(
    "Misconfigured server. Environment variable AUTH_TOKEN_SECRET is not configured"
  )
  process.exit(1)
}

try {
  if (process.env.AUTH_COOKIE_OVERRIDES) {
    const parsed = JSON.parse(process.env.AUTH_COOKIE_OVERRIDES)
    for (const k of Object.keys(parsed)) {
      config.cookieOverrides[k] = parsed[k]
    }
  }
} catch (e) {
  console.log(
    `Warning: Could not parse AUTH_COOKIE_OVERRIDES: ${process.env.AUTH_COOKIE_OVERRIDES}\n`
  )
  console.log(e)
  process.exit(1)
}

export default config
