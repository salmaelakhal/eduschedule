import prisma from '../lib/prisma.js';

// ── GET ALL SUBJECTS ──
export const getSubjects = async (req, res) => {
  try {
    const subjects = await prisma.subject.findMany({
      include: {
        teachers: {
          select: { id: true, fullName: true, email: true },
        },
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: subjects });
  } catch (err) {
    console.error('[GET_SUBJECTS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── CREATE SUBJECT ──
export const createSubject = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await prisma.subject.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Une matière avec ce nom existe déjà.',
      });
    }

    const subject = await prisma.subject.create({
      data: { name, description },
    });

    res.status(201).json({
      success: true,
      message: 'Matière créée avec succès.',
      data: subject,
    });
  } catch (err) {
    console.error('[CREATE_SUBJECT]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── UPDATE SUBJECT ──
export const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await prisma.subject.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Matière introuvable.',
      });
    }

    const subject = await prisma.subject.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.json({
      success: true,
      message: 'Matière mise à jour.',
      data: subject,
    });
  } catch (err) {
    console.error('[UPDATE_SUBJECT]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── DELETE SUBJECT ──
export const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.subject.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Matière introuvable.',
      });
    }

    // Vérifier si la matière est utilisée dans des séances
    const schedulesCount = await prisma.schedule.count({
      where: { subjectId: Number(id) },
    });
    if (schedulesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : cette matière est utilisée dans ${schedulesCount} séance(s).`,
      });
    }

    await prisma.subject.delete({ where: { id: Number(id) } });

    res.json({ success: true, message: 'Matière supprimée avec succès.' });
  } catch (err) {
    console.error('[DELETE_SUBJECT]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};