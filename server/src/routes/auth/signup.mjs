import bcrypt from 'bcrypt'
import { Router } from 'express'

import connectionPool  from "../../db/pool.mjs";
import { findByEmail } from '../../repositories/userRepository.mjs'
import generateUserName from '../../services/usernameGenerator.mjs';
const router = Router()

export const signup = async (req, res) => {
    const { email, password  } = req.body

    if (!email || !password) {
        return res
            .status(400)
            .json({ message: 'Invalid entry:password and email required' })
    }


    try {
        const existing = await findByEmail(email)
        if (existing) {
            return res.status(409).json({ message: 'Email already taken' })
        }

        const hashed = await bcrypt.hash(password, 10)
        const username = await generateUserName()
        
        await connectionPool.query(
            'INSERT INTO users (username,display_name, password_hash, email) VALUES (?, ?, ?, ?)',
            [username, username, hashed, email]
        )

        res.status(201).json({ message: 'Registered successfully' })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: err })
    }
}

export default router
