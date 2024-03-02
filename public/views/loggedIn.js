export default async function loggedIn(me) {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }

  const section = document.body.appendChild(
    Object.assign(document.createElement(`section`), {
      innerHTML: `
        <h1>Welcome ${me.id}!</h1>
        <button>Logout</button>
      `,
    })
  )

  section.querySelector(`button`).addEventListener(`click`, async () => {
    await fetch(`/api/logout`, { method: `POST` })
    document.location.reload()
  })

  await addUsers(me)

  if (!me.isAdmin) {
    return
  }

  await addResources(me)

  async function addUsers() {
    const el = document.body.appendChild(
      Object.assign(document.createElement(`section`), {
        innerHTML: `
        <h2>Users</h2>
        <div class="user header">
          <div class="userId">ID</div>
          <div class="password">Password</div>
          <div class="isAdmin">Admin</div>
        </div>
      `,
      })
    )

    const users = !me.isAdmin
      ? [me]
      : await fetch(`/api/users`).then((res) => res.json())

    users.forEach((u) => createUserRow(el, u))

    el.appendChild(
      Object.assign(document.createElement(`h3`), { innerHTML: `Add User` })
    )

    if (!me.isAdmin) {
      return
    }

    const createEl = el.appendChild(
      Object.assign(document.createElement(`form`), {
        id: `addUser`,
        className: `user`,
        innerHTML: `
        <input class="userId" name="userId" placeholder="userId">
        <input type="text" class="password" placeholder="password"></input>
        <input class="isAdmin" name="isAdmin" type="checkbox">
        <button type="submit">Add</button>`,
      })
    )

    createEl.addEventListener(`submit`, async (event) => {
      event.preventDefault()
      const userId = createEl.querySelector(`.userId`).value
      const password = createEl.querySelector(`.password`).value
      const isAdmin = createEl.querySelector(`.isAdmin`).checked
      const res = await fetch(`/api/users`, {
        method: `POST`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify({ id: userId, password, isAdmin }),
      })

      if (!res.ok) {
        alert(res.status + `: ` + (await res.text()))
        return
      }

      document.location.reload()
    })
  }

  function createUserRow(parent, user) {
    const el = parent.appendChild(
      Object.assign(document.createElement(`div`), {
        className: `user`,
        innerHTML: `
      <div class="userId">${user.id}</div>
      <input type="text" class="password"></input>
      <input ${me.isAdmin ? `` : `disabled`} type="checkbox" class="isAdmin" ${user.isAdmin ? `checked` : ``}>
      <button class="saveUser">Save</button>
      <button ${me.isAdmin ? `` : `disabled`} class="deleteUser">Delete</button>
    `,
      })
    )

    el.querySelector(`.deleteUser`).addEventListener(`click`, async () => {
      const res = await fetch(`/api/user/${encodeURIComponent(user.id)}`, {
        method: `DELETE`,
      })

      if (!res.ok) {
        alert(res.status + `: ` + (await res.text()))
        return
      }
      document.location.reload()
    })

    el.querySelector(`.saveUser`).addEventListener(`click`, async () => {
      const body = {
        password: el.querySelector(`.password`).value,
      }

      if (me.isAdmin) {
        body.isAdmin = el.querySelector(`.isAdmin`).checked
      }

      const res = await fetch(`/api/user/${encodeURIComponent(user.id)}`, {
        method: `PUT`,
        headers: {
          "Content-Type": `application/json`,
        },
        body: JSON.stringify(body),
      })

      if (!res.ok) {
        alert(res.status + `: ` + (await res.text()))
        return
      }
      document.location.reload()
    })
  }

  async function addResources() {
    const el = document.body.appendChild(
      Object.assign(document.createElement(`section`), {
        innerHTML: `
        <h2>Resources</h2>
        <ul id="resources"></ul>
      `,
      })
    )
  }
}
