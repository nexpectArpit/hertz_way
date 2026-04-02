const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'car_rental',
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10
});

const db = pool.promise();

// test connection on startup so we know immediately if DB is reachable
db.query('SELECT 1').then(() => {
    console.log('DB connected ok');
}).catch(err => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
});

module.exports = db;
