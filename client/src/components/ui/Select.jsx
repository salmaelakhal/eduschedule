export default function Select({
  label,
  error,
  value,
  onChange,
  options = [],
  placeholder = 'Sélectionner...',
  disabled = false,
  required = false,
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: 'var(--color-accent3)' }}>*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''}`}
        style={{
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : 'pointer',
          appearance: 'none',
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%238b90b8' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 12px center',
          paddingRight: 36,
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}