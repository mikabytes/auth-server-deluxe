import mainView from "./views/main.js"
import loggedInView from "./views/loggedIn.js"

const res = await fetch(`/api/user`)
let user

if (res.ok) {
  user = await res.json()
  console.log(`user is authenticated: ${JSON.stringify(user)}`)
}

if (!user) {
  mainView(user)
} else {
  loggedInView(user)
}
