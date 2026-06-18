import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';


import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import repoRoutes from './routes/repos.js';
import contributionRoutes from './routes/contributions.js';
import analyticsRoutes from './routes/analytics.js';
import leaderboardRoutes from './routes/leaderboard.js';
import notificationRoutes from './routes/notifications.js';
import insightRoutes from './routes/insights.js';
import reportRoutes from './routes/reports.js';

const app = express();
const PORT = process.env.PORT || 5000;


app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.get('/api/healthz', (_req, res) => {
  res.json({ status: 'ok' });
});


app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', repoRoutes);
app.use('/api', contributionRoutes);
app.use('/api', analyticsRoutes);
app.use('/api', leaderboardRoutes);
app.use('/api', notificationRoutes);
app.use('/api', insightRoutes);
app.use('/api', reportRoutes);


app.use((err, _req, res, _next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error' });
});


connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
