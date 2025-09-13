# Auth Server

A simple standalone authentication server Express app with support for multiple users and/or resources. It was originally forked from [andygock/auth-server](https://github.com/andygock/auth-server), but has since been completely rewritten to fit my usecase better.

It can be used for protecting web sites with NGINX subrequest authentication.

- Use `auth_request /auth` in [NGINX conf](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/).
- When user requests protected area, NGINX makes an internal request to `/auth`. If 201 is returned, protected contents are served. Anything else, NGINX responds with 401.
- `/auth` is reverse proxied to Express app auth-server-deluxe which handles authentication. Cookies are passed on as well, so the auth server can check for a [JWT](https://jwt.io/).
- Auth server sets httpOnly cookie containing a JWT.
- JWT updated with new expiry each time a user visits protected area.
- Default rate limit of 15 `/login` requests every 15 minutes.
- Defaults to setting cookie for topdomain, can be overridden with AUTH_COOKIE_OVERRIDES env variable.

## Example NGINX conf

For an example NGINX conf, see [example.conf](https://github.com/andygock/auth-server?tab=readme-ov-file#example-nginx-conf).

## References

- [Original "very simple" auth-server](https://github.com/andygock/auth-server)
- [NGINX sub request authentication](https://docs.nginx.com/nginx/admin-guide/security-controls/configuring-subrequest-authentication/)
- [Using JWTs with NodeJS tutorial](https://www.digitalocean.com/community/tutorials/nodejs-jwt-expressjs)
- [jsonwebtoken node module](https://github.com/auth0/node-jsonwebtoken)
