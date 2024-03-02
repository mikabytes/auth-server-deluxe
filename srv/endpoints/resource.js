import db, { getUser } from "../db.js"

function format(resource) {
  return {
    id: resource.id,
    regex: resource.regex,
  }
}

async function admin(req, res) {
  if (!req.userId) {
    res.status(401).end()
    return false
  }

  const user = await getUser(req.userId)

  if (!user.isAdmin) {
    res.status(401).end()
    return false
  }

  return true
}

export async function getAll(req, res) {
  if (!admin(req, res)) {
    return
  }

  res.json((await db.all(`SELECT id, regex FROM resources`)).map(format))
}

export async function get(req, res) {
  if (!admin(req, res)) {
    return
  }

  res.json(
    format(
      await db.get(
        `SELECT id, regex FROM resources WHERE id = ?`,
        req.params.id
      )
    )
  )
}

export async function create(req, res) {
  if (!admin(req, res)) {
    return
  }

  await db.run(
    `INSERT INTO resources (id, regex) VALUES (?, ?)`,
    req.body.id,
    req.body.regex
  )
  res.json({ status: `ok` })
}

export async function update(req, res) {
  if (!admin(req, res)) {
    return
  }

  await db.run(
    `UPDATE resources SET regex = ? WHERE id = ?`,
    req.body.regex,
    req.params.resourceId
  )
  res.json({ status: `ok` })
}

export async function remove(req, res) {
  if (!admin(req, res)) {
    return
  }

  await db.run(`DELETE FROM resources WHERE id = ?`, req.params.resourceId)
  res.json({ status: `ok` })
}
