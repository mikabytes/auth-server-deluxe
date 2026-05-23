import mainView from "./views/main.js"

const res = await fetch(`/api/user`)
let user

if (res.ok) {
  user = await res.json()
  console.log(`user is authenticated: ${JSON.stringify(user)}`)
}

if (!user) {
  mainView(user)
} else {
  const { default: loggedInView } = await import("./views/loggedIn.js")
  loggedInView(user)
}
