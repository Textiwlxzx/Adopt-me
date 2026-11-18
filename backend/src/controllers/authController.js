const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const {
  JWT_SECRET,
  JWT_EXPIRATION,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  OAUTH_REDIRECT_URI,
} = require('../config/env');

const VALID_ROLES = ['adopter', 'caretaker', 'admin'];

// ─── Helper: ออก JWT ของระบบเอง ───────────────────────────────────────────────
function issueToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRATION }
  );
}

// ─── POST /api/v1/auth/register ───────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const { name, email, password, phone, role, address } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required.' },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'Password must be at least 6 characters long.' },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const userRole =
      role && VALID_ROLES.includes(role.toLowerCase())
        ? role.toLowerCase()
        : 'adopter';

    const existingUser = await db.query(
      'SELECT id, email FROM users WHERE email = $1',
      [normalizedEmail]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        error: { message: 'Email is already registered.' },
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const insertResult = await db.query(
      `INSERT INTO users (name, email, password, phone, role, address)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, name, email, phone, role, address, created_at`,
      [
        name ? name.trim() : null,
        normalizedEmail,
        hashedPassword,
        phone ? phone.trim() : null,
        userRole,
        address ? address.trim() : null,
      ]
    );

    const newUser = insertResult.rows[0];
    const token = issueToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: { user: newUser, token },
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/v1/auth/login ──────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, password, identifier } = req.body;
    const loginEmail = (email || identifier || '').trim().toLowerCase();

    if (!loginEmail || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email and password are required.' },
      });
    }

    const userResult = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = $1',
      [loginEmail]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' },
      });
    }

    const user = userResult.rows[0];

    // Google-only user จะไม่มี password
    if (!user.password) {
      return res.status(401).json({
        success: false,
        error: { message: 'This account uses Google Sign-In. Please login with Google.' },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' },
      });
    }

    const token = issueToken(user);
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: { user: userWithoutPassword, token },
    });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/auth/google  (Step 1 — Redirect ไป Google consent screen) ───
async function googleOauth(req, res, next) {
  try {
    const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options = new URLSearchParams({
      redirect_uri: OAUTH_REDIRECT_URI,
      client_id: GOOGLE_CLIENT_ID,
      access_type: 'offline',
      response_type: 'code',
      prompt: 'consent',
      scope: [
        'profile',
        'email',
        'https://www.googleapis.com/auth/user.phonenumbers.read',
        'openid',
      ].join(' '),
    });

    res.redirect(`${rootUrl}?${options.toString()}`);
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/v1/auth/google/callback  (Step 2 — รับ code แล้วแลก token) ────
async function googleOauthCallback(req, res, next) {
  const { code } = req.query;

  if (!code) {
    return res.status(400).json({ success: false, error: { message: 'Authorization code missing' } });
  }

  const client = await db.pool.connect();

  try {
    // 2.1 แลก Authorization Code → Access Token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code: String(code),
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: OAUTH_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const tokens = await tokenResponse.json();

    if (!tokenResponse.ok) {
      return res.status(400).json({
        success: false,
        error: { message: 'Failed to fetch tokens from Google', details: tokens },
      });
    }

    // 2.2 ดึงข้อมูล user จาก Google People API (ชื่อ, email, เบอร์)
    const userResponse = await fetch(
      'https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,phoneNumbers',
      {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
          Accept: 'application/json',
        },
      }
    );

    const googleUser = await userResponse.json();

    if (!userResponse.ok) {
      return res.status(400).json({
        success: false,
        error: { message: 'Failed to fetch user data from Google', details: googleUser },
      });
    }

    // People API คืนค่าเป็น Array ใช้ Optional Chaining ดึงตัวแรก
    const googleId = String(googleUser.resourceName).replace('people/', '');
    const name     = googleUser.names?.[0]?.displayName || null;
    const email    = googleUser.emailAddresses?.[0]?.value || null;
    const phone    = googleUser.phoneNumbers?.[0]?.value || null;
    const provider = 'google';

    if (!email) {
      return res.status(400).json({
        success: false,
        error: { message: 'Could not retrieve email from Google account.' },
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await client.query('BEGIN');

    let userId = null;
    let isNewUser = false;

    // 1. ค้นหาใน oauthusers ก่อน (เคย login ด้วย Google แล้ว)
    const oauthQuery = await client.query(
      'SELECT userid FROM oauthusers WHERE provider_user_id = $1 AND provider = $2',
      [googleId, provider]
    );

    if (oauthQuery.rows.length > 0) {
      // เจอ record เดิม — ดึง userid
      userId = oauthQuery.rows[0].userid;
    } else {
      // ค้นหาใน users ด้วย email
      const userQuery = await client.query(
        'SELECT id FROM users WHERE LOWER(email) = $1',
        [normalizedEmail]
      );

      if (userQuery.rows.length > 0) {
        // มี user อยู่แล้ว — เชื่อม OAuth กับ user นั้น
        userId = userQuery.rows[0].id;

        await client.query(
          `INSERT INTO oauthusers (userid, provider, provider_user_id)
           VALUES ($1, $2, $3)
           ON CONFLICT (provider, provider_user_id) DO NOTHING`,
          [userId, provider, googleId]
        );
      } else {
        // สร้าง user ใหม่ (password = NULL — login ผ่าน Google เท่านั้น)
        const newUserQuery = await client.query(
          `INSERT INTO users (name, email, password, phone, role)
           VALUES ($1, $2, NULL, $3, 'adopter')
           RETURNING id`,
          [name || normalizedEmail.split('@')[0], normalizedEmail, phone || null]
        );

        userId = newUserQuery.rows[0].id;
        isNewUser = true;

        // ผูก oauthusers
        await client.query(
          `INSERT INTO oauthusers (userid, provider, provider_user_id)
           VALUES ($1, $2, $3)`,
          [userId, provider, googleId]
        );
      }
    }

    await client.query('COMMIT');

    // ดึง user data เต็มๆ เพื่อออก token
    const userResult = await db.query(
      'SELECT id, name, email, phone, role, address, created_at FROM users WHERE id = $1',
      [userId]
    );
    const user = userResult.rows[0];
    const token = issueToken(user);

    // Redirect กลับ frontend พร้อม token และ user (เข้ารหัส base64 เพื่อความปลอดภัย)
    const payload = Buffer.from(JSON.stringify({ user, token })).toString('base64url');
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    return res.redirect(`${frontendUrl}/auth/callback?payload=${payload}`);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('[OAuth] Transaction error:', error.message);
    next(error);
  } finally {
    client.release();
  }
}

module.exports = {
  register,
  login,
  googleOauth,
  googleOauthCallback,
};
