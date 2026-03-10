import { useState, useEffect } from 'react';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import Spinner from '../components/ui/Spinner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form,        setForm]        = useState({ email: '', password: '' });
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // ← renommé pour éviter le conflit

  const { login, isAuth, isLoading, user } = useAuth(); // ← un seul appel useAuth
  const navigate = useNavigate();

  // ── Redirect si déjà connecté ──
 useEffect(() => {
  if (isLoading)       return;
  if (!isAuth || !user) return; // ← !user ajouté

  if (user.role === 'ADMIN')   navigate('/admin/dashboard',   { replace: true });
  if (user.role === 'TEACHER') navigate('/teacher/dashboard', { replace: true });
  if (user.role === 'STUDENT') navigate('/student/dashboard', { replace: true });
}, [isAuth, isLoading, user]);

  const handleChange = (e) => {
    setError('');
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    if (!form.email || !form.password) return;

    setIsSubmitting(true); // ← setIsSubmitting
    setError('');

    try {
      const user = await login(form.email, form.password);
      if (user.role === 'ADMIN')   navigate('/admin/dashboard');
      if (user.role === 'TEACHER') navigate('/teacher/dashboard');
      if (user.role === 'STUDENT') navigate('/student/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Email ou mot de passe incorrect.');
    } finally {
      setIsSubmitting(false); // ← setIsSubmitting
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--color-bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* ── Background grid effect ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
          linear-gradient(rgba(108,99,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(108,99,255,0.03) 1px, transparent 1px)
        `,
          backgroundSize: "40px 40px",
          pointerEvents: "none",
        }}
      />

      {/* ── Glow orbs ── */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,99,255,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "-20%",
          right: "-10%",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(0,212,170,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* ── Card ── */}
      <div
        style={{
          width: "100%",
          maxWidth: 420,
          background: "var(--color-surface)",
          border: "1px solid var(--color-border)",
          borderRadius: 20,
          padding: 40,
          position: "relative",
          animation: "popIn 0.3s ease",
          boxShadow: "0 32px 80px rgba(0,0,0,0.4)",
        }}
      >
        {/* ── Logo ── */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              background:
                "linear-gradient(135deg, var(--color-accent), var(--color-accent2))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 16px",
              boxShadow: "0 8px 24px rgba(108,99,255,0.3)",
            }}
          >
            <GraduationCap size={28} color="white" />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 24,
              fontWeight: 800,
              color: "var(--color-text)",
              marginBottom: 6,
            }}
          >
            EduSchedule
          </h1>
          <p style={{ fontSize: 13, color: "var(--color-text2)" }}>
            Connectez-vous à votre espace
          </p>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} noValidate>
          {/* Email */}
          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Email</label>
            <input
              name="email"
              type="email"
              placeholder="votre@email.com"
              value={form.email}
              onChange={handleChange}
              className={`input ${error && !form.email ? "input-error" : ""}`}
              autoComplete="email"
              autoFocus
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: 20 }}>
            <label className="form-label">Mot de passe</label>
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPass ? "text" : "password"}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={`input ${error && !form.password ? "input-error" : ""}`}
                autoComplete="current-password"
                style={{ paddingRight: 42 }}
              />
              <button
                type="button"
                onClick={() => setShowPass((p) => !p)}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "var(--color-text2)",
                  display: "flex",
                  alignItems: "center",
                  padding: 0,
                }}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Error message */}
          {error && (
            <div
              style={{
                background: "rgba(255,107,107,0.1)",
                border: "1px solid rgba(255,107,107,0.3)",
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 12,
                color: "var(--color-accent3)",
                marginBottom: 16,
                display: "flex",
                alignItems: "center",
                gap: 8,
                animation: "slideUp 0.2s ease",
              }}
            >
              ⚠️ {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isSubmitting}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              padding: "11px 16px",
              fontSize: 14,
            }}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" color="white" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </button>
        </form>

        {/* ── Comptes test ── */}
        <div
          style={{
            marginTop: 24,
            paddingTop: 20,
            borderTop: "1px solid var(--color-border)",
          }}
        >
          <p
            style={{
              fontSize: 11,
              color: "var(--color-text3)",
              textAlign: "center",
              marginBottom: 12,
              fontFamily: "var(--font-mono)",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Comptes de test
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {[
              {
                role: "Admin",
                email: "admin@eduschedule.com",
                color: "var(--color-accent)",
              },
              {
                role: "Enseignant",
                email: "sara.moussaoui@eduschedule.com",
                color: "var(--color-accent2)",
              },
              {
                role: "Étudiant",
                email: "ahmed.tazi@eduschedule.com",
                color: "var(--color-accent3)",
              },
            ].map((account) => (
              <button
                key={account.role}
                type="button"
                onClick={() =>
                  setForm({
                    email: account.email,
                    password:
                      account.role === "Admin"
                        ? "admin123"
                        : account.role === "Enseignant"
                          ? "teacher123"
                          : "student123",
                  })
                }
                style={{
                  background: "var(--color-surface2)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  padding: "8px 12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  cursor: "pointer",
                  transition: "border-color 0.2s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.borderColor = account.color)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.borderColor = "var(--color-border)")
                }
              >
                <span
                  style={{
                    fontSize: 12,
                    color: account.color,
                    fontWeight: 600,
                  }}
                >
                  {account.role}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: "var(--color-text2)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  {account.email}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
