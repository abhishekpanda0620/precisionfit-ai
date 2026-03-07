import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import cardioRoutes from './routes/cardio';
import mealRoutes from './routes/meal';
import weightRoutes from './routes/weight';
import profileRoutes from './routes/profile';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const url = process.env.BASE_URL || "http://localhost:3001";

app.use(cors());
app.use(express.json());

// Internal Auth Routes (Secured by INTERNAL_API_SECRET)
app.use('/api/internal/auth', authRoutes);

// Public Logging Routes (will add session auth middleware later)
app.use('/api/cardio', cardioRoutes);
app.use('/api/meals', mealRoutes);
app.use('/api/weight', weightRoutes);
app.use('/api/profile', profileRoutes);

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'PrecisionFit API' });
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to PrecisionFit API' });
});

const startServer = () => {
  if (process.env.NODE_ENV !== 'production') {
    app.listen(port, () => {
      console.log(`PrecisionFit API running on ${url}`);
    });
  }
};

startServer();

export default app;
