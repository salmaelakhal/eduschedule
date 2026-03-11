import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import authRoutes    from './routes/auth.routes.js';
import userRoutes    from './routes/user.routes.js';
import classRoutes   from './routes/class.routes.js';
import roomRoutes    from './routes/room.routes.js';
import subjectRoutes from './routes/subject.routes.js';
import scheduleRoutes from './routes/schedule.routes.js';
import statsRoutes from './routes/stats.routes.js';
import scheduleLogRoutes   from './routes/scheduleLog.routes.js';
import { startWeeklyResetJob } from './jobs/weeklyReset.job.js';

dotenv.config();

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globaux ──
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());

// ── Routes ──
app.use('/api/auth',     authRoutes);
app.use('/api/users',    userRoutes);
app.use('/api/classes',  classRoutes);
app.use('/api/rooms',    roomRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/logs', scheduleLogRoutes);


// ── Route santé ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'EduSchedule API running 🚀' });
});

// ── Gestion d'erreurs globale ──
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erreur serveur interne',
  });
});

app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
startWeeklyResetJob();
