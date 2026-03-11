import prisma from '../lib/prisma.js';

// ── Sélection commune pour éviter la répétition ──
const scheduleSelect = {
  id: true,
  isOnline: true,
  createdAt: true,
  class: { select: { id: true, name: true } },
  teacher: { select: { id: true, fullName: true } },
  subject: { select: { id: true, name: true } },
  room: { select: { id: true, name: true, capacity: true } },
  timeSlot: true,
};

// ── GET ALL SCHEDULES (Admin) ──
// Query params : ?classId=1 ou ?teacherId=2
export const getSchedules = async (req, res) => {
  try {
    const { classId, teacherId } = req.query;

    const where = {};
    if (classId)   where.classId   = Number(classId);
    if (teacherId) where.teacherId = Number(teacherId);

    const schedules = await prisma.schedule.findMany({
      where,
      select: scheduleSelect,
      orderBy: [
        { timeSlot: { day: 'asc' } },
        { timeSlot: { startTime: 'asc' } },
      ],
    });

    res.json({ success: true, data: schedules });
  } catch (err) {
    console.error('[GET_SCHEDULES]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── GET MY SCHEDULE (Teacher + Student) ──
export const getMySchedule = async (req, res) => {
  try {
    const { id, role } = req.user;
    let schedules = [];

    if (role === 'TEACHER') {
      // L'enseignant voit ses propres séances
      schedules = await prisma.schedule.findMany({
        where: { teacherId: id },
        select: scheduleSelect,
        orderBy: [
          { timeSlot: { day: 'asc' } },
          { timeSlot: { startTime: 'asc' } },
        ],
      });
    }

    if (role === 'STUDENT') {
      // L'étudiant voit les séances de sa classe
      const enrollment = await prisma.enrollment.findFirst({
        where: { studentId: id },
      });

      if (!enrollment) {
        return res.status(404).json({
          success: false,
          message: 'Vous n\'êtes inscrit dans aucune classe.',
        });
      }

      schedules = await prisma.schedule.findMany({
        where: { classId: enrollment.classId },
        select: scheduleSelect,
        orderBy: [
          { timeSlot: { day: 'asc' } },
          { timeSlot: { startTime: 'asc' } },
        ],
      });
    }

    res.json({ success: true, data: schedules });
  } catch (err) {
    console.error('[GET_MY_SCHEDULE]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── GET ALL TIMESLOTS ──
export const getTimeSlots = async (req, res) => {
  try {
    const timeSlots = await prisma.timeSlot.findMany({
      orderBy: [
        { day: 'asc' },
        { startTime: 'asc' },
      ],
    });
    res.json({ success: true, data: timeSlots });
  } catch (err) {
    console.error('[GET_TIMESLOTS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── CREATE SCHEDULE (Admin) ──
export const createSchedule = async (req, res) => {
  try {
    const { classId, teacherId, subjectId, roomId, timeSlotId, isOnline } = req.body;

    // ── 1. roomId obligatoire si présentiel ──
    if (!isOnline && !roomId) {
      return res.status(400).json({
        success: false,
        message: 'Une salle est obligatoire pour une séance en présentiel.',
      });
    }

    // ── 2. Vérifier que toutes les entités existent ──
    const [classe, teacher, subject, timeSlot] = await Promise.all([
      prisma.class.findUnique({ where: { id: Number(classId) } }),
      prisma.user.findUnique({ where: { id: Number(teacherId) } }),
      prisma.subject.findUnique({ where: { id: Number(subjectId) } }),
      prisma.timeSlot.findUnique({ where: { id: Number(timeSlotId) } }),
    ]);

    if (!classe) {
      return res.status(404).json({ success: false, message: 'Classe introuvable.' });
    }
    if (!teacher) {
      return res.status(404).json({ success: false, message: 'Enseignant introuvable.' });
    }
    if (!subject) {
      return res.status(404).json({ success: false, message: 'Matière introuvable.' });
    }
    if (!timeSlot) {
      return res.status(404).json({ success: false, message: 'Créneau introuvable.' });
    }

    // ── 3. Vérifier que c'est bien un TEACHER ──
    if (teacher.role !== 'TEACHER') {
      return res.status(400).json({
        success: false,
        message: "L'utilisateur sélectionné n'est pas un enseignant.",
      });
    }

    // ── 4. Vérifier que l'enseignant enseigne cette matière ──
    if (teacher.subjectId !== Number(subjectId)) {
      return res.status(400).json({
        success: false,
        message: `Cet enseignant n'enseigne pas cette matière.`,
      });
    }

    // ── 5. Vérifier que la salle existe si présentiel ──
    if (!isOnline && roomId) {
      const room = await prisma.room.findUnique({
        where: { id: Number(roomId) },
      });
      if (!room) {
        return res.status(404).json({ success: false, message: 'Salle introuvable.' });
      }
    }

    // ── 6. Vérifier qu'une classe n'a pas déjà un autre enseignant pour cette matière ──
    const subjectTeacherConflict = await prisma.schedule.findFirst({
      where: {
        classId:   Number(classId),
        subjectId: Number(subjectId),
        NOT: { teacherId: Number(teacherId) },
      },
    });
    if (subjectTeacherConflict) {
      return res.status(409).json({
        success: false,
        message: 'Cette classe a déjà un enseignant différent pour cette matière.',
      });
    }

    // ── 7. Détection des conflits (créneaux fixes → UNIQUE suffit) ──

    // Conflit enseignant
    const teacherConflict = await prisma.schedule.findUnique({
      where: {
        teacherId_timeSlotId: {
          teacherId:  Number(teacherId),
          timeSlotId: Number(timeSlotId),
        },
      },
    });
    if (teacherConflict) {
      return res.status(409).json({
        success: false,
        message: 'Conflit : cet enseignant a déjà une séance sur ce créneau.',
      });
    }

    // Conflit classe
    const classConflict = await prisma.schedule.findUnique({
      where: {
        classId_timeSlotId: {
          classId:    Number(classId),
          timeSlotId: Number(timeSlotId),
        },
      },
    });
    if (classConflict) {
      return res.status(409).json({
        success: false,
        message: 'Conflit : cette classe a déjà une séance sur ce créneau.',
      });
    }

    // Conflit salle (seulement si présentiel)
    if (!isOnline && roomId) {
      const roomConflict = await prisma.schedule.findUnique({
        where: {
          roomId_timeSlotId: {
            roomId:     Number(roomId),
            timeSlotId: Number(timeSlotId),
          },
        },
      });
      if (roomConflict) {
        return res.status(409).json({
          success: false,
          message: 'Conflit : cette salle est déjà occupée sur ce créneau.',
        });
      }
    }

    // ── 8. Créer la séance ──
    const schedule = await prisma.schedule.create({
      data: {
        classId:    Number(classId),
        teacherId:  Number(teacherId),
        subjectId:  Number(subjectId),
        roomId:     isOnline ? null : Number(roomId),
        timeSlotId: Number(timeSlotId),
        isOnline:   Boolean(isOnline),
      },
      select: scheduleSelect,
    });

    res.status(201).json({
      success: true,
      message: 'Séance créée avec succès.',
      data: schedule,
    });
  } catch (err) {
    console.error('[CREATE_SCHEDULE]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── DELETE SCHEDULE (Admin) ──
export const deleteSchedule = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.schedule.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Séance introuvable.',
      });
    }

    await prisma.schedule.delete({ where: { id: Number(id) } });

    res.json({ success: true, message: 'Séance supprimée avec succès.' });
  } catch (err) {
    console.error('[DELETE_SCHEDULE]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};