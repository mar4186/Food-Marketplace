import cors from "cors";
import express from "express";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mysql from "mysql2";
import crypto from "crypto";

const app = express();

app.use(express.json());
app.use(cors());

// Server

const PORT = 8181;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on port ${PORT}...`);
})