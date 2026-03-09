import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './context/AuthContext'; ← on décommentera plus tard
import App from './App';
import './index.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5,
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1a1d27',
              color: '#e8eaf6',
              border: '1px solid #2e3250',
              borderRadius: '10px',
              fontSize: '13px',
            },
            success: {
              iconTheme: { primary: '#00d4aa', secondary: '#1a1d27' },
            },
            error: {
              iconTheme: { primary: '#ff6b6b', secondary: '#1a1d27' },
            },
          }}
        />
      </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>
);