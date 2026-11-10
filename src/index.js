const express = require("express");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "10kb" }));

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "15m";
const JWT_ISSUER = "jwt-access-token-api";
const JWT_AUDIENCE = "jwt-access-token-api-client";
const validExpiry = /^([1-9]\d*)(s|m|h|d)$/.test(JWT_EXPIRES_IN);

if (
    !JWT_SECRET ||
    JWT_SECRET === "replace-with-generated-secret" ||
    Buffer.byteLength(JWT_SECRET, "utf8") < 32
) {
    throw new Error(
        "JWT_SECRET must be a generated secret with at least 32 bytes. See README for setup."
    );
}
if (!validExpiry) {
    throw new Error("JWT_EXPIRES_IN must be a positive duration such as 15m or 1h.");
}

// small helper: generate access token
function signAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: JWT_EXPIRES_IN,
        issuer: JWT_ISSUER,
        audience: JWT_AUDIENCE,
    });
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
        expiresIn: JWT_EXPIRES_IN,
    });
});

// verify middleware (Bearer token)
function requireAuth(req, res, next) {
    const authorization = req.get("authorization") || "";
    const match = authorization.match(/^Bearer\s+(\S+)$/i);
    const token = match?.[1];

    if (!token) {
        return res.status(401).json({
            ok: false,
            error: "missing or invalid Authorization header",
        });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET, {
            algorithms: ["HS256"],
            issuer: JWT_ISSUER,
            audience: JWT_AUDIENCE,
        });
        if (
            typeof decoded !== "object" ||
            typeof decoded.sub !== "string" ||
            typeof decoded.exp !== "number"
        ) {
            throw new Error("Token is missing required claims.");
        }
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

app.use((req, res) => {
    return res.status(404).json({ ok: false, error: "route not found" });
});

// Keep parser errors in the same JSON response format as the API routes.
app.use((err, req, res, next) => {
    if (err?.type === "entity.too.large") {
        return res.status(413).json({ ok: false, error: "request body is too large" });
    }

    if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
        return res.status(400).json({ ok: false, error: "invalid JSON body" });
    }

    if (res.headersSent) return next(err);
    console.error(err);
    return res.status(500).json({ ok: false, error: "internal server error" });
});

const port = Number(process.env.PORT || 1198);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
}

app.listen(port, () => {
    console.log(`JWT Access Token API running on http://localhost:${port}`);
});
