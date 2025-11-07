import bcrypt from "bcrypt";
import connectionPool from '../db/pool.mjs';
import { findByEmail } from '../repositories/userRepository.mjs';

export const signup = async (req, res) => {
    const { password, email } = req.body;

    if (!password || !email) {
        return res.status(400).json({ message: "Invalid entry:password and email required" });
    }


    try {
        const existing = await findByEmail(email);
        if (existing) {
            return res.status(409).json({ message: "Email already taken" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const username = generateUserName()
        await connectionPool.query(
            "INSERT INTO users (username, password, email) VALUES (?, ?, ?)",
            [ username, hashed, email]
        );

        res.status(201).json({ message: "Registered successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal server error" });
    }
};
