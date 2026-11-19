import cors from 'cors'
import express from 'express';

const app = express();

app.use(express.json());
app.use(cors({origin: 'http://localhost:5173'}));

import authRoute from './routes/authRoutes.js';

app.use('/api/auth', authRoute);

// Server

const PORT = 8181;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port ${PORT}...`);
})