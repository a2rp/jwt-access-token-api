const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.use(express.json());

// small helper: generate access token
function signAccessToken(payload) {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || "15m";

    return jwt.sign(payload, secret, { expiresIn });
}

// health
app.get("/health", (req, res) => {
    res.json({
        ok: true,
        service: "jwt-access-token-api",
        time: new Date().toISOString(),
    });
});

// demo login - issues access token (no refresh)
// NOTE: this is a demo, so we hardcode a user check
app.post("/auth/login", (req, res) => {
    const { email, password } = req.body || {};

    // minimal validation
    if (!email || !password) {
        return res.status(400).json({
            ok: false,
            error: "email and password are required",
        });
    }

    // demo credentials
    const DEMO_EMAIL = "admin@example.com";
    const DEMO_PASSWORD = "admin123";

    if (email !== DEMO_EMAIL || password !== DEMO_PASSWORD) {
        return res.status(401).json({
            ok: false,
            error: "invalid credentials",
        });
    }

    // what goes inside token
    const payload = {
        sub: "user_001",
        email: DEMO_EMAIL,
        role: "admin",
    };

    const accessToken = signAccessToken(payload);

    return res.json({
        ok: true,
        message: "login successful",
        accessToken,
        tokenType: "Bearer",
        expiresIn: process.env.JWT_EXPIRES_IN || "15m",
    });
});

// verify middleware (Bearer token)
function requireAuth(req, res, next) {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
        return res.status(401).json({
            ok: false,
            error: "missing or invalid Authorization header",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // attach decoded payload
        return next();
    } catch (err) {
        return res.status(401).json({
            ok: false,
            error: "invalid or expired token",
        });
    }
}

// protected route
app.get("/me", requireAuth, (req, res) => {
    res.json({
        ok: true,
        user: req.user,
    });
});

const port = Number(process.env.PORT || 5000);
app.listen(port, () => {
    console.log(`JWT Access Token API running on http://localhost:${port}`);
    console.log("Demo login: admin@example.com / admin123");
});
