import prisma from '../lib/prisma.js';
import { archiveAndReset } from '../services/archive.service.js';

export const getScheduleLogs = async (req, res) => {
  try {
    const logs = await prisma.scheduleLog.findMany({
      orderBy: { archivedAt: 'desc' },
      select: {
        id:         true,
        archivedAt: true,
        weekStart:  true,
        weekEnd:    true,
        totalCount: true,
        // data exclu de la liste — trop lourd
      },
    });
    res.json({ success: true, data: { logs } });
  } catch (err) {
    console.error('[GET_LOGS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

export const getScheduleLogById = async (req, res) => {
  try {
    const log = await prisma.scheduleLog.findUnique({
      where: { id: Number(req.params.id) },
    });
    if (!log) return res.status(404).json({ success: false, message: 'Log introuvable.' });
    res.json({ success: true, data: { log } });
  } catch (err) {
    console.error('[GET_LOG_BY_ID]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ← Reset manuel
export const manualReset = async (req, res) => {
  try {
    const result = await archiveAndReset();
    res.json({ success: true, message: `${result.archived} séances archivées.`, data: result });
  } catch (err) {
    console.error('[MANUAL_RESET]', err);
    res.status(500).json({ success: false, message: 'Erreur lors de la réinitialisation.' });
  }
};