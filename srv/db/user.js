import db from "../db.js"
import digest from "../digest.js"

export async function checkAuth(userId, password) {
  const user = await db.get(`SELECT password FROM users WHERE id = ?`, userId)
  return user.password === (await digest(password))
}

export async function get(userId) {
  const user = await db.get(
    `SELECT id, isAdmin FROM users WHERE id = ?`,
    userId
  )
  user.isAdmin = !!user.isAdmin

  const userResources = await db.all(
    `SELECT resourceId FROM userResource WHERE userId = ?`,
    userId
  )
  user.resources = userResources.map((r) => r.resourceId)
  return user
}

export async function all() {
  return Promise.all(
    (await db.all(`SELECT id FROM users`)).map(({ id }) => get(id))
  )
}

export async function create(user) {
  if (!user.id || !user.password) {
    throw new Error(`user must have id and password`)
  }

  await db.run(`INSERT INTO users (id, password, isAdmin) VALUES (?, ?, ?)`, [
    user.id,
    await digest(user.password),
    user.isAdmin,
  ])
}

export async function remove(userId) {
  await db.run(`DELETE FROM users WHERE id = ?`, userId)
}

export async function update(userId, body) {
  if (body.password) {
    console.log(`setting password for ${userId} to ${body.password}`)
    body.password = await digest(body.password)
    await db.run(`UPDATE users SET password = ? WHERE id = ?`, [
      body.password,
      userId,
    ])
  }

  if (body.isAdmin === true || body.isAdmin === false) {
    await db.run(`UPDATE users SET isAdmin = ? WHERE id = ?`, [
      body.isAdmin,
      userId,
    ])
  }

  if (body.resources) {
    await db.run(`DELETE FROM userResource WHERE userId = ?`, userId)
    for (const resource of body.resources) {
      await db.run(
        `INSERT INTO userResource (userId, resourceId) VALUES (?, ?)`,
        [userId, resource]
      )
    }
  }
}
