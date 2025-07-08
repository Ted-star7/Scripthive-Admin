import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from '@/context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';


if (window.location.hash) {
  window.history.replaceState(null, '', window.location.pathname);
}

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <App />
    </AuthProvider>
  </BrowserRouter>
);