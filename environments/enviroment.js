const dotenv = require('dotenv');

dotenv.config();

const required = ['DB_USER', 'DB_PASSWORD', 'DB_HOST', 'DB_PORT', 'DB_NAME', 'NODE_ENV'];

const missing = required.filter(key => !process.env[key]);

if (missing.length > 0) {
    console.error(`Missing required environment variables: ${missing.join(', ')}`);
    process.exit(1);
}

const ENVIROMENT = {
    DB_USER: process.env.DB_USER,
    DB_PASSWORD: process.env.DB_PASSWORD,
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DEBUG: process.env.DEBUG,
    API_PORT: process.env.API_PORT,
    NODE_ENV: process.env.NODE_ENV
}

module.exports = ENVIROMENT;
