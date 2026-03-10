import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // state: 'light' | 'dark' | 'system'
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('eduschedule-theme') || 'system';
    });

    // optional: 'blue' | 'green' | 'red' | 'purple' for primary accent overriding
    const [colorScheme, setColorScheme] = useState(() => {
        return localStorage.getItem('eduschedule-color') || 'purple';
    });

    useEffect(() => {
        const root = document.documentElement;

        const applyTheme = (currentTheme) => {
            let activeTheme = currentTheme;
            if (currentTheme === 'system') {
                activeTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
            }

            // Remove all possible theme classes first
            root.classList.remove('light', 'dark', 'minuit', 'yellow', 'navy');

            // Add the currently active theme
            root.classList.add(activeTheme);
        };

        applyTheme(theme);
        localStorage.setItem('eduschedule-theme', theme);

        // Watch for system changes if set to system
        let listener;
        let mq;
        if (theme === 'system') {
            mq = window.matchMedia('(prefers-color-scheme: dark)');
            listener = (e) => {
                root.classList.remove('light', 'dark', 'minuit', 'yellow', 'navy');
                if (e.matches) {
                    root.classList.add('dark');
                } else {
                    root.classList.add('light');
                }
            };
            // Add listener using newer API
            try {
                mq.addEventListener('change', listener);
            } catch (e1) {
                mq.addListener(listener); // fallback
            }
        }

        return () => {
            if (mq && listener) {
                try {
                    mq.removeEventListener('change', listener);
                } catch (e1) {
                    mq.removeListener(listener);
                }
            }
        };
    }, [theme]);

    useEffect(() => {
        // Optionally remove old color scheme classes and add the new one
        document.documentElement.classList.remove('theme-blue', 'theme-green', 'theme-red', 'theme-purple');
        document.documentElement.classList.add(`theme-${colorScheme}`);
        localStorage.setItem('eduschedule-color', colorScheme);
    }, [colorScheme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme, colorScheme, setColorScheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
