import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import gamesRoutes from './routes/games';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth',  authRoutes);
app.use('/api/games', gamesRoutes);

app.listen(3001, () => console.log('Servidor en puerto 3001'));