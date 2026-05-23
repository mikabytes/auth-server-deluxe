const WEB_PROTOCOLS = new Set([`http:`, `https:`])

function decode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

function getRawReturnUrl(search) {
  const query = search.startsWith(`?`) ? search.slice(1) : search
  const match = /(?:^|&)rd=/.exec(query)

  if (!match) {
    return null
  }

  // NGINX configs often append rd last, and the target URL may contain &.
  return decode(query.slice(match.index + match[0].length))
}

export function getReturnUrl(
  search = window.location.search,
  baseUrl = window.location.href
) {
  const rawReturnUrl = getRawReturnUrl(search)

  if (!rawReturnUrl) {
    return null
  }

  try {
    const url = new URL(rawReturnUrl.trim(), baseUrl)

    if (!WEB_PROTOCOLS.has(url.protocol)) {
      return null
    }

    return url.href
  } catch {
    return null
  }
}

export function redirectToReturnUrl() {
  const returnUrl = getReturnUrl()

  if (!returnUrl) {
    return false
  }

  window.location.replace(returnUrl)
  return true
}
