import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import { AuthProvider } from '@/context/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

// Error Boundary for initialization errors
class AppErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error('App initialization error:', error);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{padding: '20px'}}>
          <h1>Application Error</h1>
          <p>Failed to load the application. Please refresh the page.</p>
          <button onClick={() => window.location.reload()}>Refresh</button>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")!).render(
  <AppErrorBoundary>
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </AppErrorBoundary>
);