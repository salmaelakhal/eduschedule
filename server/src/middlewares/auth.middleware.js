import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// ── Vérifier le token JWT depuis le cookie ──
export const authenticate = (req, res, next) => {
  const token = req.cookies.token; // ← depuis HttpOnly cookie

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Accès refusé. Token manquant.',
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, email, role }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Token invalide ou expiré.',
    });
  }
};

// ── Vérifier le rôle ──
export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Non authentifié.',
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Accès interdit. Rôle requis : ${roles.join(' ou ')}`,
      });
    }

    next();
  };
};