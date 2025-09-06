import express, { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser'

dotenv.config();

const app = express();

app.use(cookieParser());
const port = 8000;
// const router = express.Router();
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import aiRouter from './routes/aiRoutes.js';

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello, TypeScript !');
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);

// adding the ai routes over here . 
app.use("/api/v1/ai" , aiRouter);


console.log("hello typescript!");
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});