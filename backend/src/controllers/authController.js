const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/env');

// POST /api/v1/auth/register (สมัครสมาชิกใหม่ - 201 Created)
async function register(req, res, next) {
  try {
    const { email, password, username, name, phone } = req.body;

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
    const finalUsername = username ? username.trim() : normalizedEmail.split('@')[0];

    // Check existing email or username
    const existingUser = await db.query(
      'SELECT id, email, username FROM users WHERE email = $1 OR username = $2',
      [normalizedEmail, finalUsername]
    );

    if (existingUser.rows.length > 0) {
      const match = existingUser.rows[0];
      const conflictField = match.email === normalizedEmail ? 'Email' : 'Username';
      return res.status(409).json({
        success: false,
        error: { message: `${conflictField} is already registered.` },
      });
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user
    const insertResult = await db.query(
      `INSERT INTO users (email, username, password, name, phone)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, username, email, name, phone, role, created_at`,
      [normalizedEmail, finalUsername, hashedPassword, name || null, phone || null]
    );

    const newUser = insertResult.rows[0];

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
      data: {
        user: newUser,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

// POST /api/v1/auth/login (เข้าสู่ระบบ - 200 OK)
async function login(req, res, next) {
  try {
    const { email, username, identifier, password } = req.body;
    const loginIdentifier = (email || username || identifier || '').trim().toLowerCase();

    if (!loginIdentifier || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Email/Username and password are required.' },
      });
    }

    const userResult = await db.query(
      'SELECT * FROM users WHERE LOWER(email) = $1 OR LOWER(username) = $1',
      [loginIdentifier]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' },
      });
    }

    const user = userResult.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION }
    );

    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
};
