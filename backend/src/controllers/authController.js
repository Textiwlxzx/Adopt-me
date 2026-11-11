const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { JWT_SECRET, JWT_EXPIRATION } = require('../config/env');

const VALID_ROLES = ['adopter', 'caretaker', 'admin'];

// POST /api/v1/auth/register (สมัครสมาชิกใหม่ - 201 Created)
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
    const userRole = role && VALID_ROLES.includes(role.toLowerCase()) ? role.toLowerCase() : 'adopter';

    // Check existing email
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

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Insert user according to user table schema
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

    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
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
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid credentials.' },
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
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
