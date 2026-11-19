import express from 'express';
import db from '../config/db.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyToken from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

// Retrieve user's name

router.get('/me', verifyToken, (req, res) => {
    try{
        const userId = req.user.user_id;

        const sql = 'SELECT first_name FROM users WHERE user_id = ?';

        db.query(sql, [userId], (err, data) => {
            if(err){
                console.error(err);
                return res.status(500).json({ message: 'Database error'});
            }

            if(data.length === 0){
                return res.status(404).json({ message: 'User not found'});
            }

            res.status(200).json({
                firstName: data[0].first_name
            })
        })

    }
    catch(err){
        console.error('Database error: ', err);
        res.status(500).json({ message: 'Unable to retrieve name'});
    }
})

// login validation

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

            const accessToken = jwt.sign({
                user_id: user.user_id,
                email: user.email
            }, 
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: "1h",
            });

            res.status(200).json({ 
                message: 'Login successful',
                accessToken: accessToken,
                user: {
                    user_id: user.user_id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                },
            });
        })
    }
    catch(err){
        console.error('Login error: ', err);
        res.status(500).json({ message: 'Unable to process login'});
    }
})

// Register account

router.post('/register', async (req, res) => {
    try{
        const { firstName, lastName, email, username, password } = req.body;

        const salt = 10;

        const hashedPassword = await bcrypt.hash(password, salt);

        const profileQuery = 'INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)';

        const registerValues = [firstName, lastName, email, username, hashedPassword];

        db.query(profileQuery, registerValues, (err, result) => {
            if(err){
                console.error('Database error:', err);
                return res.status(500).json({ message: 'Unable to process user registration'});
            }

            const walletQuery = 'INSERT INTO wallets (user_id, balance) VALUES (?, ?)';

            const newUserId = result.insertId;
            const initialBalance = 0.00;

           const walletValues = [newUserId, initialBalance];

            db.query(walletQuery, walletValues, (err, walletResult) => {
               if(err){
                    console.error('Database error:', err);
                    return res.status(500).json({ message: 'Unable to process wallet registration'});
                }

                res.status(201).json({
                    message: 'User and wallet created',
                    userId: newUserId,
                    walletId: walletResult.insertId
                });
            })
        })
    }
    catch(err){
        console.error('Registration error: ', err);
        res.status(500).json({ message: 'Unable to process registration'});
    }
})

// Protected route

router.get('/protected', (req, res) => {
    res.json({
        message: 'You accessed a protected route!',
        user: req.user
    })
})

export default router;