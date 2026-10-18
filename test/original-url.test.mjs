import assert from "node:assert/strict"
import test from "node:test"
import { getOriginalUrl } from "../srv/original-url.js"

const forwarded = {
  "x-forwarded-proto": "https",
  "x-forwarded-host": "service.example.test",
  "x-forwarded-uri": "/private/a%2Fb?one=1&two=%2F",
}

test("constructs Traefik's original URL without losing path escaping or query", () => {
  assert.equal(
    getOriginalUrl({ headers: forwarded }),
    "https://service.example.test/private/a%2Fb?one=1&two=%2F"
  )
})

test("retains ingress-nginx's legacy original URL", () => {
  assert.equal(
    getOriginalUrl({ headers: { "x-original-url": "https://legacy.example.test/path" } }),
    "https://legacy.example.test/path"
  )
})

test("authoritative forwarded URL overrides a forged legacy URL", () => {
  assert.equal(
    getOriginalUrl({ headers: { ...forwarded, "x-original-url": "https://allowed.example.test/" } }),
    "https://service.example.test/private/a%2Fb?one=1&two=%2F"
  )
})

test("preserves explicit ports and IPv6 hosts", () => {
  for (const host of ["service.example.test:8443", "service.example.test:443", "[2001:db8::1]:8443"]) {
    assert.equal(getOriginalUrl({ headers: { ...forwarded, "x-forwarded-host": host } }), `https://${host}${forwarded["x-forwarded-uri"]}`)
  }
})

test("a double slash in the request path cannot replace the authorized host", () => {
  assert.equal(
    getOriginalUrl({ headers: { ...forwarded, "x-forwarded-uri": "//other.example.test/path" } }),
    "https://service.example.test//other.example.test/path"
  )
})

test("missing or malformed forwarded metadata fails closed despite a legacy URL", () => {
  const invalid = [
    { "x-forwarded-proto": undefined },
    { "x-forwarded-proto": "https,http" },
    { "x-forwarded-proto": "javascript" },
    { "x-forwarded-host": undefined },
    { "x-forwarded-host": "allowed.example.test@other.example.test" },
    { "x-forwarded-host": "service.example.test/path" },
    { "x-forwarded-host": "service.example.test,other.example.test" },
    { "x-forwarded-host": "service.example.test:99999" },
    { "x-forwarded-uri": "https://allowed.example.test/" },
    { "x-forwarded-uri": "/path\r\nX-Forged: yes" },
    { "x-forwarded-uri": ["/one", "/two"] },
  ]
  for (const changed of invalid) {
    assert.equal(getOriginalUrl({ headers: { ...forwarded, ...changed, "x-original-url": "https://allowed.example.test/" } }), null)
  }
  assert.equal(getOriginalUrl({ headers: {} }), null)
})
