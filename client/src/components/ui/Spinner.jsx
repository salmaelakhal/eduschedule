export default function Spinner({ size = 'md', color = 'accent' }) {
  const sizes = {
    sm: { width: 16, height: 16, borderWidth: 2 },
    md: { width: 24, height: 24, borderWidth: 2 },
    lg: { width: 40, height: 40, borderWidth: 3 },
  };

  const colors = {
    accent: 'var(--color-accent)',
    teal:   'var(--color-accent2)',
    white:  '#ffffff',
  };

  const s = sizes[size];

  return (
    <div
      style={{
        width:           s.width,
        height:          s.height,
        borderWidth:     s.borderWidth,
        borderStyle:     'solid',
        borderColor:     colors[color],
        borderTopColor:  'transparent',
        borderRadius:    '50%',
        animation:       'spin 0.7s linear infinite',
      }}
    />
  );
}