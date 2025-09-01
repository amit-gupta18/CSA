import express, { Router } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
const port = 8000;
// const router = express.Router();
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';

app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());



app.get('/', (req, res) => {
  res.send('Hello, TypeScript !');
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);


console.log("hello typescript!");
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});