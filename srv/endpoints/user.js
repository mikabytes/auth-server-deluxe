import * as User from "../db/user.js"

export const get = async (req, res) => {
  if (req.userId) {
    const user = await User.get(req.userId)
    res.send(user)
  } else {
    res.status(401)
    res.end()
  }
}

export const getAll = async (req, res) => {
  if (!req.userId) {
    res.status(401)
    res.end()
  }

  const user = await User.get(req.userId)

  if (!user.isAdmin) {
    res.status(401)
    res.end()
  }

  res.send(await User.all())
}

export const create = async (req, res) => {
  if (!req.userId) {
    res.status(401)
    res.end()
  }

  const user = await User.get(req.userId)

  if (!user.isAdmin) {
    res.status(401)
    res.end()
  }

  await User.create(req.body)
  res.json({ status: `ok` })
}

export const remove = async (req, res) => {
  if (!req.userId) {
    res.status(401)
    res.end()
  }

  const user = await User.get(req.userId)

  if (!user.isAdmin) {
    res.status(401)
    res.end()
  }

  await User.remove(req.params.userId)
  res.json({ status: `ok` })
}

export const update = async (req, res) => {
  if (!req.userId) {
    res.status(401)
    res.end()
  }

  const user = await User.get(req.userId)

  const onlyChangingMyOwnPassword =
    user.id === req.params.userId &&
    Object.keys(req.body).length === 1 &&
    req.body.password

  if (!onlyChangingMyOwnPassword && !user.isAdmin) {
    res.status(401)
    res.end()
    return
  }

  await User.update(req.params.userId, req.body)
  res.json({ status: `ok` })
}
