import { html, css } from "https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm"
import {
  component,
  useState,
  useEffect,
} from "https://cdn.jsdelivr.net/npm/haunted@5.0.0/+esm"

import styles from "./loggedIn.styles.js"

async function logout() {
  await fetch(`/api/logout`, { method: `POST` })
  document.location.reload()
}

const deleteUser = async (userId) => {
  const res = await fetch(`/api/user/${encodeURIComponent(userId)}`, {
    method: `delete`,
  })

  if (!res.ok) {
    alert(res.status + `: ` + (await res.text()))
    return
  }
  document.location.reload()
}

async function saveUser(e, userId) {
  const body = {
    password: e.target.parentElement.querySelector(`.password`).value,
  }

  const isAdmin = e.target.parentElement.querySelector(`.isAdmin`)
  if (isAdmin.disabled === false) {
    body.isAdmin = isAdmin.checked
  }

  //  if (resources) {
  //    body.resources = []
  //    for (const resource of resources) {
  //      if (
  //        el.queryselector(`.resource-item[name="${resource.id}"]`)
  //          .checked
  //      ) {
  //        body.resources.push(resource.id)
  //      }
  //    }
  //  }

  const res = await fetch(`/api/user/${encodeURIComponent(userId)}`, {
    method: `put`,
    headers: {
      "content-type": `application/json`,
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    alert(res.status + `: ` + (await res.text()))
    return
  }
  document.location.reload()
}

async function createUser(e) {
  e.preventDefault()

  const userId = e.target.querySelector(`.userId`).value
  const password = e.target.querySelector(`.password`).value
  const isAdmin = e.target.querySelector(`.isAdmin`).checked

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
}

async function createResource(event) {
  event.preventDefault()
  const id = event.target.querySelector(`.id`).value
  const regex = event.target.querySelector(`.regex`).value
  const url = event.target.querySelector(`.url`).value
  const res = await fetch(`/api/resources`, {
    method: `POST`,
    headers: {
      "Content-Type": `application/json`,
    },
    body: JSON.stringify({ id, regex, url }),
  })

  if (!res.ok) {
    alert(res.status + `: ` + (await res.text()))
    return
  }

  document.location.reload()
}

async function deleteResource(resource) {
  const res = await fetch(`/api/resource/${encodeURIComponent(resource.id)}`, {
    method: `DELETE`,
  })

  if (!res.ok) {
    alert(res.status + `: ` + (await res.text()))
    return
  }
  document.location.reload()
}

async function saveResource(e, resource) {
  const body = {
    regex: e.target.parentElement.querySelector(`.regex`).value,
    url: e.target.parentElement.querySelector(`.url`).value,
  }

  const res = await fetch(`/api/resource/${encodeURIComponent(resource.id)}`, {
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
}

function main({ me }) {
  if (!me) {
    return html``
  }

  const [resources, setResources] = useState(null)
  const [users, setUsers] = useState([me])
  const [selectedUserId, setSelectedUserId] = useState(me.id)

  function reloadUsers() {
    fetch(`/api/users`)
      .then((res) => res.json())
      .then((it) => setUsers(it))
  }

  function reloadResources() {
    fetch(`/api/resources`)
      .then((res) => res.json())
      .then((it) => setResources(it))
  }

  async function toggleResource(resource, userId) {
    const user = users.find((u) => u.id === userId)
    const hasResource = user.resources.find((r) => r.id === resource.id)

    let resourceIds = user.resources.map((r) => r.id)

    if (hasResource) {
      resourceIds = resourceIds.filter((r) => r !== resource.id)
    } else {
      resourceIds.push(resource.id)
    }

    const res = await fetch(`/api/user/${encodeURIComponent(userId)}`, {
      method: `put`,
      headers: {
        "content-type": `application/json`,
      },
      body: JSON.stringify({
        resources: resourceIds,
      }),
    })

    await reloadUsers()
  }

  useEffect(() => {
    if (me.isAdmin) {
      reloadResources()
      reloadUsers()
    }
  }, [me])

  const selectedUser = users.find((it) => it.id === selectedUserId)

  return html`
    <style>${styles}</style>
    <div class="oneline">
      <h1>Welcome ${me.id}!</h1>
      <button @click=${logout}>Logout</button>
    </div>

    <section>
      <h2>Users</h2>
      <div class="oneline">
        <select id="user-select" @change=${(event) => setSelectedUserId(event.target.value)}>
          ${users.map(
            (u) =>
              html`<option ${u.id === me.id ? `selected` : ``} value="${u.id}">
                ${u.id}
              </option>`
          )}
        </select>
        <div id="user-edit">
          <div id="user-meta">
            <label>Admin: <input class="isAdmin" name="isAdmin" type="checkbox" ?checked=${selectedUser.isAdmin}></label>
            <label>Password: <input type="text" class="password"></input></label>
            <button class="saveUser" @click=${(e) => saveUser(e, selectedUserId)}>Save</button>
            <button ?disabled=${!me.isAdmin} class="deleteUser" @click=${() => deleteUser(selectedUserId)}>Delete user</button>
          </div>
        </div>  
      </div>

      <div id="user-resources">
        ${
          resources
            ? resources.map(
                (it) => html`
                  <div
                    class="resource-item ${users
                      .find((it) => it.id === selectedUserId)
                      .resources.find((usr) => usr.id === it.id)
                      ? `checked`
                      : ``}"
                    @click=${() => toggleResource(it, selectedUserId)}
                  >
                    ${it.id}
                  </div>
                `
              )
            : html``
        }
      </div>
    </section>

    ${
      !me.isAdmin
        ? html``
        : html`
      <h3>Add User</h3>
      <form class="create-user" id="addUser" @submit=${(e) => createUser(e)}>
        <input class="userId" name="userId" placeholder="userId">
        <input type="text" class="password"></input>
        <input class="isAdmin" name="isAdmin" type="checkbox">
        <button type="submit">Add</button>
      </form>

      <h2>Resources</h2>
      ${
        !resources
          ? html``
          : resources.map(
              (resource) => html`<div class="resource">
              <div class="id">${resource.id}</div>
              <input type="text" class="url" value="${resource.url}"></input>
              <input type="text" class="regex" value="${resource.regex}"></input>
              <button class="saveResource" @click=${(e) => saveResource(e, resource)}>Save</button>
              <button class="deleteResource" @click=${(e) => deleteResource(resource)}>Delete</button>
            </div>
      `
            )
      }

      <h3>Add Resource</h3>
      <form class="resource" id="addResource" @submit=${(e) => createResource(e)}>
        <input class="id" name="id" placeholder="id">
        <input type="url" class="url" placeholder="url"></input>
        <input type="text" class="regex" placeholder="regex"></input>
        <button type="submit">Save</button>
      </form>
    `
    }
  `
}
customElements.define("x-main", component(main))

export default async function loggedIn(me) {
  while (document.body.firstChild) {
    document.body.removeChild(document.body.firstChild)
  }

  document.body.appendChild(
    Object.assign(document.createElement(`x-main`), { me })
  )
}
