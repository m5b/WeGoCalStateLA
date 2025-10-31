import express from 'express';
import dotenv from 'dotenv'
import cors from "cors";
import router from './routes/authRoutes.js';
import { verifyToken } from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json()); 

app.use(cors());

app.get("/hello", verifyToken, (req,res)=>{
  res.send('Hello');
})

app.use('/api/auth',router);

app.listen(3000,()=>{
  console.log('Server running on port 3000');
})
 