import cors from 'cors'
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors({origin: process.env.FRONTEND_URL}));

import authRoute from './routes/authRoutes.js';

app.use('/api/auth', authRoute);

// Server

const PORT = 8181;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port ${PORT}...`);
})