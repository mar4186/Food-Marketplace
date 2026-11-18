import cors from 'cors'
import express from 'express';

const app = express();

import authRoute from './routes/authRoutes.js';

app.use('/api/auth', authRoute);

app.use(express.json());
app.use(cors());

// Server

const PORT = 8181;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port ${PORT}...`);
})