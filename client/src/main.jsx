import { StrictMode }    from 'react';
import { createRoot }    from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster }       from 'react-hot-toast';
import { AuthProvider }  from './context/AuthContext';
import App               from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry:              1,
      refetchOnWindowFocus: false,
      staleTime:          1000 * 60 * 5, // 5 min
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <App />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color:      'var(--color-text)',
                border:     '1px solid var(--color-border)',
                fontFamily: 'var(--font-body)',
                fontSize:   13,
              },
              success: { iconTheme: { primary: 'var(--color-accent2)', secondary: 'white' } },
              error:   { iconTheme: { primary: 'var(--color-accent3)', secondary: 'white' } },
            }}
          />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>
);