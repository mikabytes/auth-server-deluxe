import db from "../db.js"

export async function all() {
  return await db.all(`SELECT id, regex FROM resources`)
}

export async function get(id) {
  return await db.get(`SELECT id, regex FROM resources WHERE id = ?`, id)
}

export async function create({ id, regex }) {
  await db.run(`INSERT INTO resources (id, regex) VALUES (?, ?)`, id, regex)
}

export async function update(id, { regex }) {
  if (!(await get(id))) {
    throw new Error(`resource ${id} does not exist`)
  }
  await db.run(`UPDATE resources SET regex = ? WHERE id = ?`, regex, id)
}

export async function remove(id) {
  if (!(await get(id))) {
    throw new Error(`resource ${id} does not exist`)
  }
  await db.run(`DELETE FROM resources WHERE id = ?`, id)
}
