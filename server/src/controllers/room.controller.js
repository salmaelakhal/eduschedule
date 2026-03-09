import prisma from '../lib/prisma.js';

// ── GET ALL ROOMS ──
export const getRooms = async (req, res) => {
  try {
    const rooms = await prisma.room.findMany({
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: rooms });
  } catch (err) {
    console.error('[GET_ROOMS]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── CREATE ROOM ──
export const createRoom = async (req, res) => {
  try {
    const { name, capacity } = req.body;

    const existing = await prisma.room.findUnique({ where: { name } });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: 'Une salle avec ce nom existe déjà.',
      });
    }

    const room = await prisma.room.create({
      data: { name, capacity: Number(capacity) },
    });

    res.status(201).json({
      success: true,
      message: 'Salle créée avec succès.',
      data: room,
    });
  } catch (err) {
    console.error('[CREATE_ROOM]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── UPDATE ROOM ──
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, capacity } = req.body;

    const existing = await prisma.room.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Salle introuvable.',
      });
    }

    const room = await prisma.room.update({
      where: { id: Number(id) },
      data: {
        name,
        capacity: capacity ? Number(capacity) : existing.capacity,
      },
    });

    res.json({ success: true, message: 'Salle mise à jour.', data: room });
  } catch (err) {
    console.error('[UPDATE_ROOM]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};

// ── DELETE ROOM ──
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const existing = await prisma.room.findUnique({
      where: { id: Number(id) },
    });
    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Salle introuvable.',
      });
    }

    // Vérifier si la salle est utilisée dans des séances
    const schedulesCount = await prisma.schedule.count({
      where: { roomId: Number(id) },
    });
    if (schedulesCount > 0) {
      return res.status(400).json({
        success: false,
        message: `Impossible de supprimer : cette salle est utilisée dans ${schedulesCount} séance(s).`,
      });
    }

    await prisma.room.delete({ where: { id: Number(id) } });

    res.json({ success: true, message: 'Salle supprimée avec succès.' });
  } catch (err) {
    console.error('[DELETE_ROOM]', err);
    res.status(500).json({ success: false, message: 'Erreur serveur.' });
  }
};