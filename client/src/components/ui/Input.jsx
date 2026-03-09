export default function Input({
  label,
  error,
  type = 'text',
  placeholder,
  value,
  onChange,
  disabled = false,
  required = false,
  ...props
}) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && (
        <label className="form-label">
          {label} {required && <span style={{ color: 'var(--color-accent3)' }}>*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`input ${error ? 'input-error' : ''}`}
        style={{ opacity: disabled ? 0.6 : 1, cursor: disabled ? 'not-allowed' : 'text' }}
        {...props}
      />
      {error && (
        <p style={{ fontSize: 11, color: 'var(--color-accent3)', marginTop: 4 }}>
          {error}
        </p>
      )}
    </div>
  );
}