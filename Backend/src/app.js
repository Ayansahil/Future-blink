import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import aiRoutes from './routes/ai.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

// Routes
app.use('/api', aiRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Wildcard route to serve index.html for all non-API requests (for React Router)
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

export default app;