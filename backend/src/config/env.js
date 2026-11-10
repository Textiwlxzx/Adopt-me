require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DB: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    database: process.env.DB_NAME || 'dev',
    user: process.env.DB_USER || 'dev',
    password: process.env.DB_PASSWORD || 'aa1234',
  },
  JWT_SECRET: process.env.JWT_SECRET || 'secret123',
  JWT_EXPIRATION: process.env.JWT_EXPIRATION || '24h',
  PASSWORD_SALT: process.env.PASSWORD_ENDEC_SALT || 'saltSALT',
};
