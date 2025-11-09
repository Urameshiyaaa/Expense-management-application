import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';


const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({origin: 'http://localhost:5173'}));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.listen(PORT, () => {
  console.log(`Backend server đang chạy tại http://localhost:${PORT}`);
});