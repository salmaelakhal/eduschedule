import cron from 'node-cron';
import { archiveAndReset } from '../services/archive.service.js';

export function startWeeklyResetJob() {
  cron.schedule('59 23 * * 0', async () => {
    console.log('[CRON] Démarrage archivage hebdomadaire...');
    try {
      const result = await archiveAndReset();
      console.log('[CRON] ✅', result);
    } catch (err) {
      console.error('[CRON] ❌ Erreur:', err);
    }
  }, {
    timezone: 'Africa/Casablanca',
  });

  console.log('[CRON] Job planifié — dimanche 23h59');
}