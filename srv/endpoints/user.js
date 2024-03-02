import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../db.js"

export const get = async (req, res) => {
  if (req.userId) {
    const user = await getUser(req.userId)
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

  const user = await getUser(req.userId)

  if (!user.isAdmin) {
    res.status(401)
    res.end()
  }

  res.send(await getAllUsers())
}

export const create = async (req, res) => {
  if (!req.userId) {
    res.status(401)
    res.end()
  }

  const user = await getUser(req.userId)

  if (!user.isAdmin) {
    res.status(401)
    res.end()
  }

  await createUser(req.body)
  res.json({ status: `ok` })
}

export const remove = async (req, res) => {
  if (!req.userId) {
    res.status(401)
    res.end()
  }

  const user = await getUser(req.userId)

  if (!user.isAdmin) {
    res.status(401)
    res.end()
  }

  await deleteUser(req.params.userId)
  res.json({ status: `ok` })
}

export const update = async (req, res) => {
  if (!req.userId) {
    res.status(401)
    res.end()
  }

  const user = await getUser(req.userId)

  const onlyChangingMyOwnPassword =
    user.id === req.params.userId &&
    Object.keys(req.body).length === 1 &&
    req.body.password

  if (!onlyChangingMyOwnPassword && !user.isAdmin) {
    res.status(401)
    res.end()
    return
  }

  await updateUser(req.params.userId, req.body)
  res.json({ status: `ok` })
}
