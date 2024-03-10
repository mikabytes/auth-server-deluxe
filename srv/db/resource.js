import db from "../db.js"

import { invalidateCache as invalidateUserCache } from "./user.js"

export async function all() {
  return await db.all(`SELECT id, url, regex FROM resources`)
}

export async function get(id) {
  return await db.get(`SELECT id, url, regex FROM resources WHERE id = ?`, id)
}

export async function create({ id, url, regex }) {
  await db.run(
    `INSERT INTO resources (id, url, regex) VALUES (?, ?, ?)`,
    id,
    url,
    regex
  )
  invalidateUserCache()
}

export async function update(id, { regex, url }) {
  if (!(await get(id))) {
    throw new Error(`resource ${id} does not exist`)
  }
  await db.run(
    `UPDATE resources SET regex = ?, url = ? WHERE id = ?`,
    regex,
    url,
    id
  )
  invalidateUserCache()
}

export async function remove(id) {
  if (!(await get(id))) {
    throw new Error(`resource ${id} does not exist`)
  }
  await db.run(`DELETE FROM resources WHERE id = ?`, id)
  await db.run(`DELETE FROM userResource WHERE resourceId = ?`, id)
  invalidateUserCache()
}
