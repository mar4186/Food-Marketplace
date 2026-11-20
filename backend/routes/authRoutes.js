import express from 'express';
import db from '../config/db.js';
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import verifyToken from '../middleware/authMiddleware.js';

dotenv.config();
const router = express.Router();

// Retrieve user's first name

router.get('/me', verifyToken, async (req, res) => {
    try{
        const userId = req.user.user_id;

        const firstNameQuery = 'SELECT first_name FROM users WHERE user_id = ?';

        const [firstNameData] = await db.query(firstNameQuery, [userId]);

        if(firstNameData.length === 0){
            return res.status(404).json({ message: 'User not found'});
        }

        res.status(200).json({ firstName: firstNameData[0].first_name });
    }
    catch(err){
        console.error('Database error: ', err);
        res.status(500).json({ message: 'Unable to retrieve name'});
    }
})

// login validation

router.post('/login', async (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;

        if(!username){
            return res.status(400).json({ message: 'Username is required'});
        }
        else if(!password){
            return res.status(400).json({ message: 'Password is required'});
        }

        const loginQuery = 'SELECT * FROM users WHERE username = ?';

        const [loginData] = await db.query(loginQuery, [username]);

        if(loginData.length === 0){
            return res.status(401).json({ message: 'Invalid username or password'});
        }

        const user = loginData[0];

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
    }
    catch(err){
        console.error('Login error: ', err);
        res.status(500).json({ message: 'Unable to process login'});
    }
});

// Register account

router.post('/register', async (req, res) => {
    try{
        const { firstName, lastName, email, username, password } = req.body;

        if(!firstName){
            return res.status(400).json({ message: 'First name is required'} );
        }
        if(!lastName){
            return res.status(400).json({ message: 'Last name is required'} );
        }
        if(!email){
            return res.status(400).json({ message: 'Email is required'} );
        }
        if(!username){
            return res.status(400).json({ message: 'Username is required'} );
        }
        else if(username.length < 3){
            return res.status(400).json({ message: 'Username must be at least 3 characters' });
        }

        if(!password){
            return res.status(400).json({ message: 'Password is required'} );
        }
        else if(password.length < 8){
            return res.status(400).json({ message: 'Password must be at least 8 characters'} );
        }

        const salt = 10;
        const hashedPassword = await bcrypt.hash(password, salt);

        const profileQuery = 'INSERT INTO users (first_name, last_name, email, username, password) VALUES (?, ?, ?, ?, ?)';
        const registerValues = [firstName, lastName, email, username, hashedPassword];

        const [registerData] = await db.query(profileQuery, registerValues);

        const walletQuery = 'INSERT INTO wallets (user_id, balance) VALUES (?, ?)';

        const newUserId = registerData.insertId;
        const initialBalance = 0.00;

        const walletValues = [newUserId, initialBalance];

        const [walletData] = await db.query(walletQuery, walletValues);

        res.status(201).json({
            message: 'Registered successfully!',
            userId: newUserId,
            walletId: walletData.insertId
        });
    }
    catch(err){
        console.error('Registration error: ', err);
        res.status(500).json({ message: 'Unable to process user registration'});
    }
});

// Protected route

router.get('/protected', (req, res) => {
    res.json({
        message: 'You accessed a protected route!',
        user: req.user
    })
})

export default router;