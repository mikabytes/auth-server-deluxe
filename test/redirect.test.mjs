import assert from "node:assert/strict"
import test from "node:test"

import { getReturnUrl } from "../public/redirect.js"

const baseUrl = `https://auth.example.test/`

test(`gets encoded return URL from rd`, () => {
  assert.equal(
    getReturnUrl(
      `?%2Ftransmission%2Fweb%2F&rd=https%3A%2F%2Fservice.example.test%2Ftransmission%2Fweb%2F`,
      baseUrl
    ),
    `https://service.example.test/transmission/web/`
  )
})

test(`preserves unencoded query strings when rd is the final parameter`, () => {
  assert.equal(
    getReturnUrl(`?rd=https://service.example.test/path?a=1&b=2`, baseUrl),
    `https://service.example.test/path?a=1&b=2`
  )
})

test(`resolves relative return URLs against the login page`, () => {
  assert.equal(
    getReturnUrl(`?rd=%2Flogged-in`, baseUrl),
    `https://auth.example.test/logged-in`
  )
})

test(`ignores missing or unsafe return URLs`, () => {
  assert.equal(getReturnUrl(``, baseUrl), null)
  assert.equal(getReturnUrl(`?rd=javascript%3Aalert(1)`, baseUrl), null)
  assert.equal(getReturnUrl(`?rd=data%3Atext%2Fhtml%2Cnope`, baseUrl), null)
})
