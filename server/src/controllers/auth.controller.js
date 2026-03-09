import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../lib/prisma.js';
import dotenv from 'dotenv';

dotenv.config();

// ── Config cookie ──
const COOKIE_OPTIONS = {
  httpOnly: true,   // inaccessible par JavaScript ✅
  secure: process.env.NODE_ENV === 'production', // HTTPS en prod
  sameSite: 'strict', // protection CSRF ✅
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours en ms
};

// ── Générer un token JWT ──
const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ── REGISTER ──
export const register = async (req, res) => {
  try {
    const { fullName, email, password, role, subjectId, classId } = req.body;

    // Vérifier si email déjà utilisé
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Cet email est déjà utilisé.',
      });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 12);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        role: role || 'STUDENT',
        subjectId: role === 'TEACHER' && subjectId ? Number(subjectId) : null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        subjectId: true,
      },
    });

    // Si STUDENT → inscription à la classe
    if (role === 'STUDENT' && classId) {
      await prisma.enrollment.create({
        data: {
          studentId: user.id,
          classId: Number(classId),
        },
      });
    }

    // Générer le token et le mettre dans un cookie
    const token = generateToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès.',
      data: { user }, // ← pas de token dans la réponse JSON
    });
  } catch (err) {
    console.error('[REGISTER]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── LOGIN ──
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        subject: { select: { id: true, name: true } },
        enrollments: {
          include: {
            class: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Email ou mot de passe incorrect.',
      });
    }

    // Générer le token et le mettre dans un cookie
    const token = generateToken(user);
    res.cookie('token', token, COOKIE_OPTIONS);

    // Retourner sans le mot de passe
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      success: true,
      message: 'Connexion réussie.',
      data: { user: userWithoutPassword }, // ← pas de token dans la réponse JSON
    });
  } catch (err) {
    console.error('[LOGIN]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── GET ME ──
export const getMe = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        subject: { select: { id: true, name: true } },
        enrollments: {
          include: {
            class: { select: { id: true, name: true } },
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    console.error('[GET_ME]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── LOGOUT ──
export const logout = (req, res) => {
  res.clearCookie('token', COOKIE_OPTIONS);
  res.json({ success: true, message: 'Déconnecté avec succès.' });
};