import { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Monitor } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const themeOptions = [
        { value: 'light', label: 'Clair', icon: Sun },
        { value: 'dark', label: 'Sombre', icon: Moon },
        { value: 'minuit', label: 'Minuit', icon: Moon },
        { value: 'navy', label: 'Marine', icon: Moon },
        { value: 'yellow', label: 'Jaune', icon: Sun },
        { value: 'system', label: 'Système', icon: Monitor },
    ];

    const CurrentIcon = themeOptions.find(t => t.value === theme)?.icon || Sun;

    return (
        <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                title="Changer le thème"
                style={{
                    background: 'transparent',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    width: 34,
                    height: 34,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    color: 'var(--color-text2)',
                    transition: 'all 0.2s',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.borderColor = 'var(--color-accent)';
                    e.currentTarget.style.color = 'var(--color-accent)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'var(--color-border)';
                    e.currentTarget.style.color = 'var(--color-text2)';
                }}
            >
                <CurrentIcon size={15} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: 'calc(100% + 8px)',
                    right: 0,
                    background: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: 8,
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    padding: 6,
                    minWidth: 140,
                    zIndex: 50,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 2,
                }}>
                    {themeOptions.map(({ value, label, icon: Icon }) => (
                        <button
                            key={value}
                            onClick={() => {
                                setTheme(value);
                                setIsOpen(false);
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                width: '100%',
                                padding: '8px 12px',
                                background: theme === value ? 'var(--color-surface2)' : 'transparent',
                                border: 'none',
                                borderRadius: 6,
                                color: theme === value ? 'var(--color-accent)' : 'var(--color-text)',
                                cursor: 'pointer',
                                fontSize: 13,
                                fontWeight: theme === value ? 600 : 400,
                                transition: 'background 0.2s',
                            }}
                            onMouseEnter={e => {
                                if (theme !== value) e.currentTarget.style.background = 'var(--color-surface2)';
                            }}
                            onMouseLeave={e => {
                                if (theme !== value) e.currentTarget.style.background = 'transparent';
                            }}
                        >
                            <Icon size={14} />
                            {label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
