export default () => {
  document.body.appendChild(
    Object.assign(document.createElement(`form`), {
      innerHTML: `
      <input type="text" id="userId" name="userId">
      <input type="password" id="password" name="password">
      <button type="submit" id="submit">Login</button>
    `,
    })
  )

  document.querySelector(`form`).addEventListener(`submit`, async (event) => {
    event.preventDefault()

    const userId = document.querySelector(`#userId`).value
    const password = document.querySelector(`#password`).value

    const res = await fetch(`/api/login`, {
      method: `POST`,
      headers: {
        "Content-Type": `application/json`,
      },
      body: JSON.stringify({ userId, password }),
    })

    if (!res.ok) {
      alert(res.status + `: ${await res.text()}`)
      return
    }

    document.location.reload()
  })
}
