import { refresh } from "../cookie.js"
import { sign } from "../jwt.js"
import { get as getUser } from "../db/user.js"
import { getOriginalUrl } from "../original-url.js"

// Endpoint called by the ingress controller's authentication subrequest.
// expect JWT in cookie 'authToken'
export const get = async (req, res, next) => {
  // parameters from original client request
  // these could be used for validating request
  const url = getOriginalUrl(req)

  if (!req.userId || !url) {
    // not authenticated
    return res.sendStatus(401)
  }

  const user = await getUser(req.userId)

  if (!user.resources.find((it) => it.regex.test(url))) {
    return res.sendStatus(401)
  }

  const token = sign({ userId: req.userId })
  refresh({ req, res, token })

  return res.sendStatus(200)
}
