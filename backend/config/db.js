import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

const db = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();
db.getConnection((err, conn) => {
    if(err){
        console.error('Database connection failed: ', err);
        return;
    }

    console.log('Connected to database');
    conn.release();
})

export default db;