import prisma from "../lib/prisma.js";

export const getStats = async (req, res) => {
  try {
    const [
  totalUsers,
  totalClasses,
  totalRooms,
  totalSchedules,
  totalTeachers,
  totalStudents,
  totalSubjects,
  schedulesBySubject,
] = await Promise.all([
  prisma.user.count(),
  prisma.class.count(),
  prisma.room.count(),
  prisma.schedule.count(),
  prisma.user.count({ where: { role: "TEACHER" } }),
  prisma.user.count({ where: { role: "STUDENT" } }),
  prisma.subject.count(),
  prisma.schedule.groupBy({
    by: ["subjectId"],
    _count: { _all: true },
  }),
]);

const schedules = await prisma.schedule.findMany({
  include: { timeSlot: true },
});



    // Enrichir schedulesBySubject avec les noms
const subjects = await prisma.subject.findMany({ select: { id: true, name: true } });
const schedulesBySubjectNamed = schedulesBySubject.map((s) => ({
  name:  subjects.find((sub) => sub.id === s.subjectId)?.name || 'Inconnu',
  value: s._count._all,
}));

const DAY_ORDER = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
const DAY_LABEL = { LUNDI: 'Lun', MARDI: 'Mar', MERCREDI: 'Mer', JEUDI: 'Jeu', VENDREDI: 'Ven', SAMEDI: 'Sam' };
const dayCount = {};

schedules.forEach((s) => {
  const day = s.timeSlot.day;
  dayCount[day] = (dayCount[day] || 0) + 1;
});

const schedulesByDayFormatted = DAY_ORDER.map((day) => ({
  day: DAY_LABEL[day],
  count: dayCount[day] || 0,
}));
    // Séances aujourd'hui
    const today = new Date();
    const days = [
      "DIMANCHE",
      "LUNDI",
      "MARDI",
      "MERCREDI",
      "JEUDI",
      "VENDREDI",
      "SAMEDI",
    ];
    const todayDay = days[today.getDay()];

    const todaySchedules = await prisma.schedule.findMany({
      where: { timeSlot: { day: todayDay } },
      select: {
        isOnline: true,
        subject: { select: { name: true } },
        room: { select: { name: true } },
        class: { select: { name: true } },
        teacher: { select: { fullName: true } },
        timeSlot: { select: { startTime: true, endTime: true, day: true } },
      },
      orderBy: { timeSlot: { startTime: "asc" } },
    });

    res.json({
      success: true,
      data: {
        totalUsers,
        totalClasses,
        totalRooms,
        totalSchedules,
        totalTeachers,
        totalStudents,
        totalSubjects,
        todaySchedules,
        schedulesByDay:     schedulesByDayFormatted,   
  schedulesBySubject: schedulesBySubjectNamed,   
      },
    });
  } catch (err) {
    console.error("[GET_STATS]", err);
    res.status(500).json({ success: false, message: "Erreur serveur." });
  }
};
