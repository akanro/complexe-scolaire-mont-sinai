import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './contexts/AuthContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { registerSW } from 'virtual:pwa-register';

// Prevent uncaught chunk preload errors from crashing the app during updates or local usage
if (typeof window !== 'undefined') {
  window.addEventListener('vite:preloadError', (event) => {
    event.preventDefault();
    console.warn('[MégafixaEduc] Module chunk reload requested');
    const reloadKey = 'megafixa_preload_reload';
    const lastReload = parseInt(sessionStorage.getItem(reloadKey) || '0', 10);
    const now = Date.now();
    if (now - lastReload > 30000) {
      sessionStorage.setItem(reloadKey, now.toString());
      window.location.reload();
    }
  });
}

// Background PWA service worker registration without disruptive reload prompts
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  try {
    registerSW({
      immediate: false,
      onNeedRefresh() {
        console.log('[PWA] Nouvelle version prête en arrière-plan.');
      },
      onOfflineReady() {
        console.log('[PWA] MégafixaEduc disponible hors-ligne.');
      }
    });
  } catch (err) {
    console.warn('[PWA] Service worker registration bypassed:', err);
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ErrorBoundary>
  </StrictMode>,
);

