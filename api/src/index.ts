import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', service: 'PrecisionFit API' });
});

app.listen(port, () => {
  console.log(`PrecisionFit API (Guardrails & Services) running on port ${port}`);
});
