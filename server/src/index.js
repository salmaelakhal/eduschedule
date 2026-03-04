import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Routes (on les ajoutera après)
// import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// ── Middlewares globaux ──
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

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