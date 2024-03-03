const salt = `g4mlkg5hngil3fkpox,epwcejgeger98u;vcsdokpvcw4`

const digest = async (message, { algorithm = "SHA-256" } = {}) =>
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

export default digest
