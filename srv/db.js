import { AsyncDatabase } from "promised-sqlite3"
import digest from "./digest.js"

const db = await AsyncDatabase.open(`db.sqlite`)

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

await migrate()

export default db
