const mysql = require('mysql2/promise');
const ENVIRONMENT = require('../environments/enviroment');

const connection = mysql.createPool({
    host: ENVIRONMENT.DB_HOST,
    user: ENVIRONMENT.DB_USER,
    password: ENVIRONMENT.DB_PASSWORD,
    database: ENVIRONMENT.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

async function testConnection() {
    try {
        const conn = await connection.getConnection();
        console.log('Database connection successful');
        conn.release();
    } catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
}

module.exports = {
    connection,
    testConnection
};

