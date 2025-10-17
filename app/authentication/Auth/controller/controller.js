//logic that will run when the route is hit '/'

import pool from "../config/db.js"; // path to  db.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signup = async (req,res) => {
  
  const {username, password} = req.body

  try{
    const hashed = await bcrypt.hash(password,10);
    await pool.query(`INSERT INTO users (username, password) values(?,?)`,[username,hashed]);
    res.json({message: "registed successfully"})
  }catch(err){
    console.error(err)
    res.json({error:err.message})
  }

}

export const login = async (req,res) => {
  const {username,password} = req.body

  try {
    const [rows] = await pool.query("SELECT * FROM users WHERE username=?", [username]);
    if(rows.length === 0) return res.json({message: "User not found"});
    
    const matched = await bcrypt.compare(password,rows[0].password);
    if( !matched) return res.json({message: "Invalid password"});
    
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({message: "Login successful",token})
    
  } catch (err) {
      console.error(err)
      res.json({error:err.message})
  }

}