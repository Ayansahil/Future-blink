import express from 'express';
import cors from 'cors';
import aiRoutes from './routes/ai.routes.js';

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Routes
app.use('/api', aiRoutes);

// Health check
app.get('/', (req, res) => res.json({ 
    status: 'Backend running ✓' 
}));

export default app;