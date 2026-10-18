// The ingress proxy must overwrite the forwarded headers before calling /auth.
// Traefik supplies this triple; ingress-nginx supplies X-Original-URL instead.
export function getOriginalUrl(req) {
  const headers = req.headers
  const uri = headers["x-forwarded-uri"]

  if (uri === undefined) {
    const original = headers["x-original-url"]
    return typeof original === "string" ? original : null
  }

  const protocol = headers["x-forwarded-proto"]
  const host = headers["x-forwarded-host"]
  if (
    !["http", "https"].includes(protocol) ||
    typeof host !== "string" ||
    !host ||
    /[\\/\s@?#,]/.test(host) ||
    typeof uri !== "string" ||
    !uri.startsWith("/") ||
    /[\u0000-\u0020\u007f]/.test(uri)
  ) {
    return null
  }

  try {
    new URL(`${protocol}://${host}/`)
  } catch {
    return null
  }

  // Concatenate rather than resolve: a path starting // must stay a path,
  // and permission matching must retain the original escaping and query.
  return `${protocol}://${host}${uri}`
}
