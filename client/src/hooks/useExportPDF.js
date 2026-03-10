import { useCallback } from 'react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DAYS_ORDER = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
const DAYS_LABEL = { LUNDI: 'Lundi', MARDI: 'Mardi', MERCREDI: 'Mercredi', JEUDI: 'Jeudi', VENDREDI: 'Vendredi', SAMEDI: 'Samedi' };

const COLORS = [
  [108, 99,  255],
  [0,   212, 170],
  [255, 107, 107],
  [255, 200, 100],
  [167, 139, 250],
  [52,  211, 153],
];

export function useExportPDF() {
  const exportPDF = useCallback(({
    schedules = [],
    timeSlots = [],
    title     = 'Emploi du temps',
    subtitle  = '',
    filename  = 'emploi-du-temps.pdf',
  }) => {
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
    const W   = pdf.internal.pageSize.getWidth();
    const H   = pdf.internal.pageSize.getHeight();

    // ── Background ──
    pdf.setFillColor(15, 15, 26);
    pdf.rect(0, 0, W, H, 'F');

    // ── Header bar ──
    pdf.setFillColor(108, 99, 255);
    pdf.rect(0, 0, W, 14, 'F');

    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(13);
    pdf.setFont('helvetica', 'bold');
    pdf.text('EduSchedule', 10, 9.5);

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    const dateStr = new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    pdf.text(dateStr, W - 10, 9.5, { align: 'right' });

    // ── Title ──
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text(title, W / 2, 24, { align: 'center' });

    if (subtitle) {
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.setTextColor(160, 160, 200);
      pdf.text(subtitle, W / 2, 30, { align: 'center' });
    }

    // ── Extraire heures uniques ──
    const uniqueHours = [];
    const seen = new Set();
    for (const slot of timeSlots) {
      const key = `${slot.startTime}-${slot.endTime}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueHours.push({ startTime: slot.startTime, endTime: slot.endTime });
      }
    }

    // ── Largeur fixe pour toutes les colonnes horaires ──
    const colWidth = (297 - 18 - 20) / uniqueHours.length; // A4 paysage - colonne Jour - marge

    const findSlot   = (day, startTime) => timeSlots.find((s) => s.day === day && s.startTime === startTime) || null;
    const findSeance = (slotId) => schedules.find((s) => s.timeSlot?.id === slotId) || null;

    // ── Palette matières ──
    const subjectColorMap = {};
    let colorIdx = 0;
    for (const s of schedules) {
      const sid = s.subject?.id;
      if (sid && !subjectColorMap[sid]) {
        subjectColorMap[sid] = COLORS[colorIdx % COLORS.length];
        colorIdx++;
      }
    }

    // ── Construire le tableau ──
    const head = [['Jour', ...uniqueHours.map((h) => `${h.startTime}\n${h.endTime}`)]];

    const body = DAYS_ORDER.map((day) => {
      const row = [DAYS_LABEL[day]];
      for (const h of uniqueHours) {
        const slot   = findSlot(day, h.startTime);
        const seance = slot ? findSeance(slot.id) : null;
        if (seance) {
          const lines = [
            seance.subject?.name || '',
            seance.teacher?.fullName?.split(' ').slice(-1)[0] || '',
            seance.isOnline ? 'En ligne' : (seance.room?.name || ''),
          ];
          row.push(lines.join('\n'));
        } else {
          row.push('');
        }
      }
      return row;
    });

    // ── Render table ──
    autoTable(pdf, {
      startY:      subtitle ? 35 : 30,
      head,
      body,
      theme:       'grid',
      styles: {
        fontSize:    7,
        cellPadding: 2,
        halign:      'center',
        valign:      'middle',
        textColor:   [220, 220, 240],
        lineColor:   [40, 40, 70],
        lineWidth:   0.3,
        fillColor:   [20, 20, 40],
        minCellHeight: 18,
      },
      headStyles: {
        fillColor:  [30, 30, 60],
        textColor:  [180, 180, 255],
        fontStyle:  'bold',
        fontSize:   7,
        minCellHeight: 10,
      },
      columnStyles: {
        0: { fillColor: [25, 25, 50], textColor: [180, 180, 255], fontStyle: 'bold', cellWidth: 18 },
        ...Object.fromEntries(uniqueHours.map((_, i) => [i + 1, { cellWidth: colWidth }])),
      },

      // Colorier les cellules avec séances
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index > 0) {
          const dayIdx  = data.row.index;
          const hourIdx = data.column.index - 1;
          const day     = DAYS_ORDER[dayIdx];
          const h       = uniqueHours[hourIdx];
          if (!h) return;
          const slot   = findSlot(day, h.startTime);
          const seance = slot ? findSeance(slot.id) : null;
          if (seance) {
            const color = subjectColorMap[seance.subject?.id] || COLORS[0];
            data.cell.styles.fillColor  = [color[0] * 0.3, color[1] * 0.3, color[2] * 0.3];
            data.cell.styles.textColor  = color;
            data.cell.styles.fontStyle  = 'bold';
          }
        }
      },
    });

    // ── Footer ──
    pdf.setFontSize(8);
    pdf.setTextColor(80, 80, 120);
    pdf.text(`Généré par EduSchedule — ${new Date().toLocaleString('fr-FR')}`, W / 2, H - 5, { align: 'center' });

    pdf.save(filename);
  }, []);

  return { exportPDF };
}