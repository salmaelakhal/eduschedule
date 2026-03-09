import bcrypt from 'bcryptjs';
import prisma from '../lib/prisma.js';

// ── GET ALL USERS ──
export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
        subject: { select: { id: true, name: true } },
        enrollments: {
          include: {
            class: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: users });
  } catch (err) {
    console.error('[GET_USERS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── GET USER BY ID ──
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        createdAt: true,
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
    console.error('[GET_USER_BY_ID]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── CREATE USER ──
export const createUser = async (req, res) => {
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

    // Vérifier si subjectId existe si TEACHER
    if (role === 'TEACHER' && subjectId) {
      const subject = await prisma.subject.findUnique({
        where: { id: Number(subjectId) },
      });
      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Matière introuvable.',
        });
      }
    }

    // Vérifier si classId existe si STUDENT
    if (role === 'STUDENT' && classId) {
      const classe = await prisma.class.findUnique({
        where: { id: Number(classId) },
      });
      if (!classe) {
        return res.status(404).json({
          success: false,
          message: 'Classe introuvable.',
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 12);

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
        createdAt: true,
        subject: { select: { id: true, name: true } },
      },
    });

    // Si STUDENT → inscription automatique à la classe
    if (role === 'STUDENT' && classId) {
      await prisma.enrollment.create({
        data: {
          studentId: user.id,
          classId: Number(classId),
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Utilisateur créé avec succès.',
      data: user,
    });
  } catch (err) {
    console.error('[CREATE_USER]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── UPDATE USER ──
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { fullName, email, password, role, subjectId } = req.body;

    // Vérifier si l'utilisateur existe
    const existing = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    // Vérifier si le nouvel email est déjà pris par un autre user
    if (email && email !== existing.email) {
      const emailTaken = await prisma.user.findUnique({ where: { email } });
      if (emailTaken) {
        return res.status(409).json({
          success: false,
          message: 'Cet email est déjà utilisé.',
        });
      }
    }

    // Construire les données à mettre à jour
    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (email)    updateData.email = email;
    if (role)     updateData.role = role;
    if (password) updateData.password = await bcrypt.hash(password, 12);
    if (role === 'TEACHER' && subjectId) {
      updateData.subjectId = Number(subjectId);
    }
    if (role !== 'TEACHER') {
      updateData.subjectId = null;
    }

    const user = await prisma.user.update({
      where: { id: Number(id) },
      data: updateData,
      select: {
        id: true,
        fullName: true,
        email: true,
        role: true,
        subject: { select: { id: true, name: true } },
      },
    });

    res.json({
      success: true,
      message: 'Utilisateur mis à jour.',
      data: user,
    });
  } catch (err) {
    console.error('[UPDATE_USER]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── DELETE USER ──
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Empêcher la suppression de son propre compte
    if (Number(id) === req.user.id) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas supprimer votre propre compte.',
      });
    }

    const existing = await prisma.user.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Utilisateur introuvable.',
      });
    }

    await prisma.user.delete({ where: { id: Number(id) } });

    res.json({
      success: true,
      message: 'Utilisateur supprimé avec succès.',
    });
  } catch (err) {
    console.error('[DELETE_USER]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};