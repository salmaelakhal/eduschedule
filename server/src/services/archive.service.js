import fs    from 'fs';
import path  from 'path';
import prisma from '../lib/prisma.js';

export async function archiveAndReset() {
  // 1. Récupérer toutes les séances
  const schedules = await prisma.schedule.findMany({
    include: {
      class:    { select: { id: true, name: true } },
      teacher:  { select: { id: true, fullName: true, email: true } },
      subject:  { select: { id: true, name: true } },
      room:     { select: { id: true, name: true, capacity: true } },
      timeSlot: { select: { id: true, day: true, startTime: true, endTime: true } },
    },
  });

  if (schedules.length === 0) {
    return { archived: 0, message: 'Aucune séance à archiver.' };
  }

  // 2. Dates semaine
  const now       = new Date();
  const weekEnd   = new Date(now);
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - 6);

  // 3. Sauvegarder en DB
  const log = await prisma.scheduleLog.create({
    data: {
      weekStart,
      weekEnd,
      totalCount: schedules.length,
      data:       schedules,
    },
  });

  // 4. Sauvegarder en fichier JSON
  const logsDir  = path.join(process.cwd(), 'logs');
  if (!fs.existsSync(logsDir)) fs.mkdirSync(logsDir);
  const filename = `schedule-${weekStart.toISOString().split('T')[0]}.json`;
  fs.writeFileSync(
    path.join(logsDir, filename),
    JSON.stringify({
      archivedAt: now,
      weekStart,
      weekEnd,
      totalCount: schedules.length,
      schedules,
    }, null, 2)
  );

  // 5. Supprimer toutes les séances
  await prisma.schedule.deleteMany();

  console.log(`[ARCHIVE] ✅ ${schedules.length} séances archivées → log #${log.id}`);
  return { archived: schedules.length, logId: log.id, filename };
}