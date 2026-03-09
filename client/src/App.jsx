export default function App() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 32,
          fontWeight: 800,
          color: 'var(--color-accent)',
          marginBottom: 8,
        }}>
          EduSchedule
        </h1>
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: 12,
          color: 'var(--color-text2)',
        }}>
          Setup ✅ — UI en cours...
        </p>
      </div>
    </div>
  );
}