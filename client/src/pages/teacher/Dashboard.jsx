import { useRef, Fragment } from "react";
import { FileDown, BookOpen, Users } from "lucide-react";
import Spinner from "../../components/ui/Spinner";
import { useAuth } from "../../context/AuthContext";
import { useMySchedule, useTimeSlots } from "../../hooks/useSchedule";
import { useExportPDF } from "../../hooks/useExportPDF";

const DAYS_ORDER = [
  "LUNDI",
  "MARDI",
  "MERCREDI",
  "JEUDI",
  "VENDREDI",
  "SAMEDI",
];
const DAYS_LABEL = {
  LUNDI: "Lundi",
  MARDI: "Mardi",
  MERCREDI: "Mercredi",
  JEUDI: "Jeudi",
  VENDREDI: "Vendredi",
  SAMEDI: "Samedi",
};

export default function TeacherDashboard() {
  const { exportPDF } = useExportPDF();

  const gridRef = useRef(null);
  const { user } = useAuth();

  const { data: schedules = [], isLoading } = useMySchedule();
  const { data: timeSlots = [] } = useTimeSlots();

  const uniqueHours = [];
  const seen = new Set();
  for (const slot of timeSlots) {
    const key = `${slot.startTime}-${slot.endTime}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueHours.push({ startTime: slot.startTime, endTime: slot.endTime });
    }
  }
  const findSlot = (day, startTime) =>
    timeSlots.find((s) => s.day === day && s.startTime === startTime) || null;
  const findSeance = (slotId) =>
    schedules.find((s) => s.timeSlot?.id === slotId) || null;

  const uniqueClasses = [
    ...new Set(schedules.map((s) => s.class?.name).filter(Boolean)),
  ];
  const STATS = [
    {
      label: "Séances / semaine",
      value: schedules.length,
      icon: BookOpen,
      color: "var(--color-accent2)",
    },
    {
      label: "Classes assignées",
      value: uniqueClasses.length,
      icon: Users,
      color: "var(--color-accent)",
    },
  ];

  if (isLoading)
    return (
      <div style={{ padding: 40, display: "flex", justifyContent: "center" }}>
        <Spinner size="md" />
      </div>
    );

  return (
    <div className="content-area">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(2, 1fr)",
          gap: 16,
          marginBottom: 24,
          maxWidth: 500,
        }}
      >
        {STATS.map((stat, i) => (
          <div key={i} className="stat-card">
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                right: 0,
                height: 3,
                background: stat.color,
              }}
            />
            <div
              className="icon-box"
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                background: `${stat.color}20`,
              }}
            >
              <stat.icon size={16} style={{ color: stat.color }} />
            </div>
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        ))}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div
          style={{ fontSize: 13, fontWeight: 700, color: "var(--color-text2)" }}
        >
          <span style={{ color: "var(--color-accent2)" }}>📅</span> Mon emploi
          du temps —{" "}
          <span style={{ color: "var(--color-text)" }}>
            {user?.subject?.name || "Enseignant"}
          </span>
        </div>
        <button
          onClick={() =>
            exportPDF({
              schedules,
              timeSlots,
              title: `Mon emploi du temps`,
              subtitle: user?.subject?.name || "",
              filename: "mon-emploi-du-temps.pdf",
            })
          }
          className="btn-ghost"
          style={{ display: "flex", alignItems: "center", gap: 6 }}
        >
          <FileDown size={14} /> Exporter PDF
        </button>
      </div>

      <div ref={gridRef} className="schedule-grid-wrap">
        <div
          className="schedule-grid"
          style={{
            gridTemplateColumns: `90px repeat(${uniqueHours.length}, 1fr)`,
          }}
        >
          <div className="sg-header">Jour / Heure</div>
          {uniqueHours.map((h) => (
            <div key={h.startTime} className="sg-header">
              {h.startTime}–{h.endTime}
            </div>
          ))}
          {DAYS_ORDER.map((day) => (
            <Fragment key={day}>
              <div className="sg-day">{DAYS_LABEL[day]}</div>
              {uniqueHours.map((h) => {
                const slot = findSlot(day, h.startTime);
                const seance = slot ? findSeance(slot.id) : null;
                return (
                  <div
                    key={`${day}-${h.startTime}`}
                    className="sg-cell"
                    style={{ cursor: "default" }}
                  >
                    {seance && (
                      <div
                        className="sg-event"
                        style={{
                          background: "rgba(0,212,170,0.15)",
                          borderLeft: "3px solid var(--color-accent2)",
                        }}
                      >
                        <div
                          className="sg-event-subject"
                          style={{ color: "var(--color-accent2)" }}
                        >
                          {seance.subject?.name}
                        </div>
                        <div className="sg-event-info">
                          🏫 {seance.class?.name}
                        </div>
                        <div className="sg-event-info">
                          {seance.isOnline
                            ? "🌐 En ligne"
                            : `🚪 ${seance.room?.name}`}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>

      <div
        style={{
          marginTop: 12,
          fontSize: 11,
          color: "var(--color-text2)",
          display: "flex",
          gap: 16,
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span
            style={{
              display: "inline-block",
              width: 10,
              height: 10,
              borderRadius: 2,
              background: "rgba(0,212,170,0.15)",
              border: "2px solid var(--color-accent2)",
            }}
          />
          Séance assignée
        </span>
        <span>🌐 En ligne &nbsp;|&nbsp; 🚪 Présentiel</span>
      </div>
    </div>
  );
}
