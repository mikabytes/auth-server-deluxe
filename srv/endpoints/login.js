import { sign } from "../jwt.js"
import { refresh } from "../cookie.js"
import { checkAuth } from "../db.js"

export default async (req, res) => {
  const { userId, password } = req.body

  if (await checkAuth(userId, password)) {
    const token = sign({ userId })

    refresh({ res, token })
    return res.json({ status: "ok" })
  }

  res.status(401)
  res.json({ status: "fail", message: "Invalid credentials" })
}
