import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DoorOpen,
  BookOpen,
  CalendarDays,
  LogOut,
  History,
} from "lucide-react";

const MENU = [
  {
    label: "Navigation",
    items: [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { to: "/admin/users", icon: Users, label: "Users" },
      { to: "/admin/classes", icon: GraduationCap, label: "Classes" },
      { to: "/admin/rooms", icon: DoorOpen, label: "Rooms" },
      { to: "/admin/subjects", icon: BookOpen, label: "Subjects" },
      { to: "/admin/schedule", icon: CalendarDays, label: "Schedule" },
      { to: "/admin/historique", icon: History, label: "Historique" }, // ← ajoute
    ],
  },
];

export default function Sidebar({ user, onLogout }) {
  const initials =
    user?.fullName
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "AD";

  return (
    <aside
      style={{
        width: 220,
        minHeight: "100vh",
        background: "var(--color-surface)",
        borderRight: "1px solid var(--color-border)",
        display: "flex",
        flexDirection: "column",
        flexShrink: 0,
        position: "sticky",
        top: 0,
      }}
    >
      {/* ── Logo ── */}
      <div
        style={{
          padding: "20px 16px 16px",
          borderBottom: "1px solid var(--color-border)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background:
                "linear-gradient(135deg, var(--color-accent), var(--color-accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              boxShadow: "0 4px 12px rgba(108,99,255,0.3)",
            }}
          >
            <GraduationCap size={18} color="white" />
          </div>
          <div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                fontWeight: 700,
                color: "var(--color-accent)",
                letterSpacing: "-0.3px",
              }}
            >
              EduSchedule
            </div>
            <div style={{ fontSize: 10, color: "var(--color-text2)" }}>
              Administration
            </div>
          </div>
        </div>
      </div>

      {/* ── Menu ── */}
      <nav style={{ padding: "12px 8px", flex: 1, overflowY: "auto" }}>
        {MENU.map((section) => (
          <div key={section.label} style={{ marginBottom: 8 }}>
            <div
              style={{
                fontSize: 9,
                fontWeight: 700,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--color-text3)",
                padding: "8px 8px 4px",
              }}
            >
              {section.label}
            </div>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                style={({ isActive }) => ({
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "9px 10px",
                  borderRadius: 8,
                  marginBottom: 2,
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive
                    ? "var(--color-accent)"
                    : "var(--color-text2)",
                  background: isActive
                    ? "rgba(108,99,255,0.12)"
                    : "transparent",
                  textDecoration: "none",
                  transition: "all 0.15s",
                  cursor: "pointer",
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.style.background.includes("0.12")) {
                    e.currentTarget.style.background = "var(--color-surface2)";
                    e.currentTarget.style.color = "var(--color-text)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.style.background.includes("0.12")) {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--color-text2)";
                  }
                }}
              >
                {({ isActive }) => (
                  <>
                    <item.icon
                      size={16}
                      style={{
                        color: isActive
                          ? "var(--color-accent)"
                          : "var(--color-text2)",
                        flexShrink: 0,
                      }}
                    />
                    {item.label}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </nav>

      {/* ── Footer user ── */}
      <div
        style={{
          padding: "12px 10px",
          borderTop: "1px solid var(--color-border)",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background:
              "linear-gradient(135deg, var(--color-accent), var(--color-accent2))",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 11,
            fontWeight: 700,
            color: "white",
            flexShrink: 0,
          }}
        >
          {initials}
        </div>
        <div style={{ flex: 1, overflow: "hidden" }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--color-text)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.fullName || "Admin"}
          </div>
          <div
            style={{
              fontSize: 10,
              color: "var(--color-text2)",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {user?.email || ""}
          </div>
        </div>
        <button
          onClick={onLogout}
          title="Se déconnecter"
          style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            color: "var(--color-text2)",
            display: "flex",
            alignItems: "center",
            padding: 4,
            borderRadius: 6,
            transition: "color 0.2s",
            flexShrink: 0,
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-accent3)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-text2)")
          }
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}
