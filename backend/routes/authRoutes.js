import express from 'express';
import db from './config/db.js';
import bcrypt from "bcrypt";
import crypto from "crypto";

const router = express.Router();

router.get('/', (req, res) => {
    res.status(200).json({ message: "Hi!" })
})

router.post('/login', (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        const sql = 'SELECT * FROM users WHERE username = ?';

        db.query(sql, [username], async (err, data) => {
            if(err){
                console.error(err);

                return res.status(500).json({ message: 'Database error'});
            }

            if(data.length === 0){
                return res.status(401).json({ message: 'Invalid username or password'});
            }

            const user = data[0];
                
            const isMatching = await bcrypt.compare(password, user.password);

            if(!isMatching){
                return res.status(401).json({ message: 'Invalid username or password'});
            }

            res.status(200).json({ message: 'Login successful' });
        })
    }
    catch(err){
        console.error('Registration error: ', err);
        res.status(500).json({ message: 'Unable to process login'});
    }
})

router.post('/register', async (req, res) => {
    try{
        const { firstName, lastName, email, username, password } = req.body;

        const salt = 10;

        const hashedPassword = await bcrypt.hash(password, salt);

        const sql = 'INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)';

        const values = [firstName, lastName, email, username, hashedPassword];

        const result = await db.query(sql, values);

        res.status(201).json({ 
            message: 'User registered and created',
            userId: result.insertId
        });
    }
    catch(err){
        console.error('Registration error: ', err);
        res.status(500).json({ message: 'Unable to process registration'});
    }
})

export default router;