import db from "../db.js"

import { invalidateCache as invalidateUserCache } from "./user.js"

export async function all() {
  return await db.all(`SELECT id, regex FROM resources`)
}

export async function get(id) {
  return await db.get(`SELECT id, regex FROM resources WHERE id = ?`, id)
}

export async function create({ id, regex }) {
  await db.run(`INSERT INTO resources (id, regex) VALUES (?, ?)`, id, regex)
  invalidateUserCache()
}

export async function update(id, { regex }) {
  if (!(await get(id))) {
    throw new Error(`resource ${id} does not exist`)
  }
  await db.run(`UPDATE resources SET regex = ? WHERE id = ?`, regex, id)
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
