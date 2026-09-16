# JWT Access Token API

A minimal backend micro project that demonstrates how to:

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

Create a `.env` file in root:

```env
PORT=1198
JWT_SECRET=super_secret_change_me
JWT_EXPIRES_IN=15m
```

### Variable Explanation

- PORT: Server port
- JWT_SECRET: Secret key used to sign tokens
- JWT_EXPIRES_IN: Access token expiry duration (example: 15m, 1h)

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
2. Server verifies credentials
3. Server issues JWT access token
4. Client sends token in Authorization header
5. Middleware verifies token
6. Protected route returns user data

No refresh token is used in this demo.

---

## Demo Credentials

Email: admin@example.com  
Password: admin123

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
        "exp": 1700000900
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

---

## How Token Works

When user logs in:

- Payload is created
- Token is signed using JWT_SECRET
- Expiry is added automatically
- Client stores token
- Client sends token in Authorization header

Middleware verifies:

- Signature is valid
- Token not expired
- Extracts payload
- Attaches payload to req.user

---

## Security Notes

- JWT_SECRET must never be committed
- Always use strong secret in production
- Use HTTPS in real deployments
- Do not store sensitive data in token payload

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