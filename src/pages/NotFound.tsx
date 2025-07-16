import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthProvider';

export default function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Log the 404 error
    console.error(`404 at ${location.pathname}`);
    
    // Redirect to login if not authenticated
    if (!user) {
      navigate('/login', { replace: true });
    } else {
      // Optionally redirect to dashboard if authenticated
      navigate('/dashboard', { replace: true });
    }
  }, [navigate, user, location]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="text-lg mb-6">The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => navigate(user ? '/dashboard' : '/login')}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Go to {user ? 'Dashboard' : 'Login'}
      </button>
    </div>
  );
}