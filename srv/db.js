import { AsyncDatabase } from "promised-sqlite3"

const db = await AsyncDatabase.open(`db.sqlite`)

const salt = `g4mlkg5hngil3fkpox,epwcejgeger98u;vcsdokpvcw4`

export const digest = async (message, { algorithm = "SHA-256" } = {}) =>
  Array.prototype.map
    .call(
      new Uint8Array(
        await crypto.subtle.digest(
          algorithm,
          new TextEncoder().encode(message + salt)
        )
      ),
      (x) => ("0" + x.toString(16)).slice(-2)
    )
    .join("")

export async function migrate() {
  let { user_version: version } = await db.get(`PRAGMA user_version;`)

  async function run(sql) {
    console.log(sql)
    await db.run(sql)
  }

  async function bump() {
    await db.run(`PRAGMA user_version = ${++version}`)
  }

  const migrations = [
    `CREATE TABLE users (id TEXT PRIMARY KEY, password TEXT, isAdmin BOOLEAN);`,
    `INSERT INTO users (id, password, isAdmin) VALUES ('admin', '${await digest("admin")}', true);`,
    `CREATE TABLE resources (id TEXT PRIMARY KEY, regex TEXT);`,
    `CREATE TABLE userResource (userId TEXT, resourceId TEXT, UNIQUE(userId, resourceId));`,
  ]

  for (
    let m = migrations[version];
    !!m;
    await bump(), m = migrations[version]
  ) {
    console.log()
    console.log(`--- migrating database to version ${version + 1}`)
    if (typeof m === `string`) {
      await run(m)
    } else {
      await m()
    }
  }
}

export async function checkAuth(userId, password) {
  const user = await db.get(`SELECT password FROM users WHERE id = ?`, userId)
  return user.password === (await digest(password))
}

export async function getUser(userId) {
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

export async function getAllUsers() {
  return Promise.all(
    (await db.all(`SELECT id FROM users`)).map(({ id }) => getUser(id))
  )
}

export async function createUser(user) {
  if (!user.id || !user.password) {
    throw new Error(`user must have id and password`)
  }

  await db.run(`INSERT INTO users (id, password, isAdmin) VALUES (?, ?, ?)`, [
    user.id,
    await digest(user.password),
    user.isAdmin,
  ])
}

export async function deleteUser(userId) {
  await db.run(`DELETE FROM users WHERE id = ?`, userId)
}

export async function updateUser(userId, body) {
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

await migrate()

export default db
