const mysql = require('mysql2');

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT, 10),
    ssl: {
        minVersion: 'TLSv1.2'
    },
    waitForConnections: true,
    connectionLimit: 10
});

const db = pool.promise();

db.query('SELECT 1')
    .then(() => console.log('DB connected ok'))
    .catch(err => {
        console.error('DB connection failed:', err.message);
        process.exit(1);
    });






module.exports = db;


