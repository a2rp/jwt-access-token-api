# JWT Access Token API

A small, demo-only Express API that demonstrates how to:

- Issue a JWT access token
- Verify token using middleware
- Protect routes
- Handle invalid or expired tokens

This project intentionally does NOT implement refresh tokens.
It focuses only on access token flow.

---

## Tech Stack

- Node.js
- Express
- jsonwebtoken
- dotenv

---

## Installation

```bash
git clone <your-repo-url>
cd jwt-access-token-api
npm install
```

---

## Environment Variables

Create a `.env` file in the project root:

```env
PORT=1198
JWT_SECRET=replace-with-generated-secret
JWT_EXPIRES_IN=15m
```

Replace the placeholder with a cryptographically generated secret. Generate one with:

```bash
node -p "require('node:crypto').randomBytes(32).toString('base64url')"
```

The server exits at startup if `JWT_SECRET` is missing, is still the placeholder, or contains fewer than 32 bytes.

### Variable Explanation

- PORT: Server port
- JWT_SECRET: Generated secret used to sign tokens; never commit it
- JWT_EXPIRES_IN: Positive access-token lifetime with a unit (`15m`, `1h`, `30s`, or `1d`)

---

## Run Server

Development mode:

```bash
npm run dev
```

Production mode:

```bash
npm start
```

Server will start at:

```
http://localhost:1198
```

---

## Project Structure

```
jwt-access-token-api/
│
├── src/
│   └── index.js
│
├── .env
├── .gitignore
├── rest.http
├── package.json
└── README.md
```

---

## Authentication Flow

1. Client sends email + password to /auth/login
2. Server checks the demo credentials shown below
3. Server issues JWT access token
4. Client sends token in Authorization header
5. Middleware verifies token
6. Protected route returns user data

No refresh token is used in this demo.

---

## Demo Credentials

Email: admin@example.com  
Password: admin123

These public demo credentials are hardcoded for learning. They are not a real account store or password-authentication implementation.

---

## API Routes

---

### 1. Health Check

GET /health

Returns service status.

Response:

```json
{
    "ok": true,
    "service": "jwt-access-token-api",
    "time": "2026-02-13T10:00:00.000Z"
}
```

---

### 2. Login - Issue Access Token

POST /auth/login

Request Body:

```json
{
    "email": "admin@example.com",
    "password": "admin123"
}
```

Successful Response:

```json
{
    "ok": true,
    "message": "login successful",
    "accessToken": "<JWT_TOKEN>",
    "tokenType": "Bearer",
    "expiresIn": "15m"
}
```

Invalid Credentials Response:

```json
{
    "ok": false,
    "error": "invalid credentials"
}
```

Missing Fields Response:

```json
{
    "ok": false,
    "error": "email and password are required"
}
```

---

### 3. Protected Route

GET /me

Header:

Authorization: Bearer <JWT_TOKEN>

Successful Response:

```json
{
    "ok": true,
    "user": {
        "sub": "user_001",
        "email": "admin@example.com",
        "role": "admin",
        "iat": 1700000000,
        "exp": 1700000900,
        "iss": "jwt-access-token-api",
        "aud": "jwt-access-token-api-client"
    }
}
```

Invalid or Expired Token Response:

```json
{
    "ok": false,
    "error": "invalid or expired token"
}
```

Unknown routes return a JSON `404`. Malformed JSON returns `400`, and request bodies larger than 10 KB return `413`.

---

## How Token Works

When user logs in:

- Payload is created
- Token is signed using JWT_SECRET
- Expiry is added automatically
- Client handles the token according to its own security and storage model
- Client sends token in Authorization header

Middleware verifies:

- Signature is valid
- HS256 is the expected signing algorithm
- Issuer, audience, and expiration are valid
- Extracts payload
- Attaches payload to req.user

---

## Security Notes

- Tokens use HS256 and the API verifies the expected algorithm, issuer, audience, and expiry.
- `JWT_EXPIRES_IN` accepts a positive duration with an explicit seconds, minutes, hours, or days unit.
- A signed JWT is readable by anyone holding it; the signature does not encrypt its payload. Keep sensitive data out of claims.
- Keep `JWT_SECRET` out of source control and generate a separate secret for each issuer and audience.
- This demo has hardcoded credentials and no login rate limiting, real user store, token revocation, or refresh flow. Do not deploy it as an authentication service without replacing those parts.
- Use HTTPS for deployed services.
- JSON request bodies are limited to 10 KB.

---

## Learning Objectives

This micro project demonstrates:

- Stateless authentication
- Token signing and verification
- Express middleware for route protection
- Basic API structure
- Environment configuration

---

## Future Improvements

- Add refresh token flow
- Add logout with token blacklist
- Add RBAC role middleware
- Add rate limiter
- Move auth middleware to separate file
- Add proper folder structure

---

## License

MIT

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me A Coffee: [https://buymeacoffee.com/a2rp](https://buymeacoffee.com/a2rp)
- Patreon: [https://patreon.com/a2rp](https://patreon.com/a2rp)
