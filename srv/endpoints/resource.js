import { get as getUser } from "../db/user.js"
import * as Resource from "../db/resource.js"

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

  try {
    res.json(await Resource.all())
  } catch (e) {
    res.status(500)
    res.json({ error: e.message })
  }
}

export async function get(req, res) {
  if (!admin(req, res)) {
    return
  }

  try {
    res.json(await Resource.get(req.params.id))
  } catch (e) {
    res.status(500)
    res.json({ error: e.message })
  }
}

export async function create(req, res) {
  if (!admin(req, res)) {
    return
  }

  try {
    await Resource.create(req.body)
    res.json({ status: `ok` })
  } catch (e) {
    res.status(500)
    res.json({ error: e.message })
  }
}

export async function update(req, res) {
  if (!admin(req, res)) {
    return
  }

  try {
    await Resource.update(req.params.resourceId, req.body)
    res.json({ status: `ok` })
  } catch (e) {
    res.status(500)
    res.json({ error: e.message })
  }
}

export async function remove(req, res) {
  if (!admin(req, res)) {
    return
  }

  try {
    await Resource.remove(req.params.resourceId)
    res.json({ status: `ok` })
  } catch (e) {
    res.status(500)
    res.json({ error: e.message })
  }
}
