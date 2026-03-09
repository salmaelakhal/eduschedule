import prisma from '../lib/prisma.js';

// ── GET ALL CLASSES ──
export const getClasses = async (req, res) => {
  try {
    const classes = await prisma.class.findMany({
      include: {
        enrollments: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
        _count: { select: { schedules: true } },
      },
      orderBy: { name: 'asc' },
    });

    res.json({ success: true, data: classes });
  } catch (err) {
    console.error('[GET_CLASSES]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── GET CLASS BY ID ──
export const getClassById = async (req, res) => {
  try {
    const { id } = req.params;

    const classe = await prisma.class.findUnique({
      where: { id: Number(id) },
      include: {
        enrollments: {
          include: {
            student: {
              select: { id: true, fullName: true, email: true },
            },
          },
        },
        schedules: {
          include: {
            teacher: { select: { id: true, fullName: true } },
            subject: { select: { id: true, name: true } },
            room: { select: { id: true, name: true } },
            timeSlot: true,
          },
        },
      },
    });

    if (!classe) {
      return res.status(404).json({
        success: false,
        message: 'Classe introuvable.',
      });
    }

    res.json({ success: true, data: classe });
  } catch (err) {
    console.error('[GET_CLASS_BY_ID]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── CREATE CLASS ──
export const createClass = async (req, res) => {
  try {
    const { name, description } = req.body;

    const existing = await prisma.class.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Une classe avec ce nom existe déjà.',
      });
    }

    const classe = await prisma.class.create({
      data: { name, description },
    });

    res.status(201).json({
      success: true,
      message: 'Classe créée avec succès.',
      data: classe,
    });
  } catch (err) {
    console.error('[CREATE_CLASS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── UPDATE CLASS ──
export const updateClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const existing = await prisma.class.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Classe introuvable.',
      });
    }

    const classe = await prisma.class.update({
      where: { id: Number(id) },
      data: { name, description },
    });

    res.json({
      success: true,
      message: 'Classe mise à jour.',
      data: classe,
    });
  } catch (err) {
    console.error('[UPDATE_CLASS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── DELETE CLASS ──
export const deleteClass = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.class.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Classe introuvable.',
      });
    }

    await prisma.class.delete({ where: { id: Number(id) } });

    res.json({ success: true, message: 'Classe supprimée avec succès.' });
  } catch (err) {
    console.error('[DELETE_CLASS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── ADD STUDENT TO CLASS ──
export const addStudentToClass = async (req, res) => {
  try {
    const { id } = req.params;
    const { studentId } = req.body;

    // Vérifier que la classe existe
    const classe = await prisma.class.findUnique({
      where: { id: Number(id) },
    });
    if (!classe) {
      return res.status(404).json({
        success: false,
        message: 'Classe introuvable.',
      });
    }

    // Vérifier que l'utilisateur existe et est bien un étudiant
    const student = await prisma.user.findUnique({
      where: { id: Number(studentId) },
    });
    if (!student || student.role !== 'STUDENT') {
      return res.status(404).json({
        success: false,
        message: 'Étudiant introuvable.',
      });
    }

    // Vérifier si déjà inscrit
    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: Number(studentId),
          classId: Number(id),
        },
      },
    });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Cet étudiant est déjà inscrit dans cette classe.',
      });
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: Number(studentId),
        classId: Number(id),
      },
      include: {
        student: { select: { id: true, fullName: true, email: true } },
        class: { select: { id: true, name: true } },
      },
    });

    res.status(201).json({
      success: true,
      message: 'Étudiant inscrit avec succès.',
      data: enrollment,
    });
  } catch (err) {
    console.error('[ADD_STUDENT_TO_CLASS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── REMOVE STUDENT FROM CLASS ──
export const removeStudentFromClass = async (req, res) => {
  try {
    const { id, studentId } = req.params;

    const existing = await prisma.enrollment.findUnique({
      where: {
        studentId_classId: {
          studentId: Number(studentId),
          classId: Number(id),
        },
      },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Inscription introuvable.',
      });
    }

    await prisma.enrollment.delete({
      where: {
        studentId_classId: {
          studentId: Number(studentId),
          classId: Number(id),
        },
      },
    });

    res.json({
      success: true,
      message: 'Étudiant retiré de la classe avec succès.',
    });
  } catch (err) {
    console.error('[REMOVE_STUDENT_FROM_CLASS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};