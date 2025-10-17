import express from 'express';
import dotenv from 'dotenv'
import cors from "cors";
import router from './routes/authRoutes.js';

dotenv.config();

const app = express();
app.use(express.json()); 

app.use(cors());

app.get("/",(req,res)=>{
  res.send('Hello express');
})

app.use('/api/auth',router);

app.listen(3000,()=>{
  console.log('Server running on port 3000');
})
 