import { redirectToReturnUrl } from "../redirect.js"

export default () => {
  document.body.appendChild(
    Object.assign(document.createElement(`main`), {
      className: `login-shell`,
      innerHTML: `
      <form class="login-card">
        <div class="login-brand">
          <img class="login-logo" src="/icon.png" alt="">
          <div>
            <p class="login-kicker">Auth Server</p>
            <h1>Sign in</h1>
          </div>
        </div>

        <div class="login-field">
          <label for="userId">User:</label>
          <input type="text" id="userId" name="userId" autocomplete="username" required autofocus>
        </div>

        <div class="login-field">
          <label for="password">Password:</label>
          <input type="password" id="password" name="password" autocomplete="current-password" required>
        </div>

        <p class="login-error" role="alert" hidden></p>

        <button class="login-submit" type="submit" id="submit">Login</button>
      </form>
    `,
    })
  )

  document.querySelector(`form`).addEventListener(`submit`, async (event) => {
    event.preventDefault()

    const form = event.currentTarget
    const submit = form.querySelector(`#submit`)
    const error = form.querySelector(`.login-error`)
    const userId = form.querySelector(`#userId`).value
    const password = form.querySelector(`#password`).value

    submit.disabled = true
    error.hidden = true

    const res = await fetch(`/api/login`, {
      method: `POST`,
      headers: {
        "Content-Type": `application/json`,
      },
      body: JSON.stringify({ userId, password }),
    })

    if (!res.ok) {
      submit.disabled = false
      error.textContent = res.status + `: ${await res.text()}`
      error.hidden = false
      return
    }

    if (!redirectToReturnUrl()) {
      document.location.reload()
    }
  })
}
