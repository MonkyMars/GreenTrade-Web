import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { loading, isAuthenticated, user } = useAuth();
  const router = useRouter();
  const [redirecting, setRedirecting] = useState(false);
  const [waitingForAuth, setWaitingForAuth] = useState(true);

  useEffect(() => {
    // Track if we're waiting for authentication
    let authCheckTimer: NodeJS.Timeout;
    
    if (loading) {
      // Give some grace period for authentication to complete
      authCheckTimer = setTimeout(() => {
        setWaitingForAuth(false);
      }, 2000); // 2 seconds grace period
    } else {
      setWaitingForAuth(false);
    }
    
    return () => {
      if (authCheckTimer) {
        clearTimeout(authCheckTimer);
      }
    };
  }, [loading, isAuthenticated]);
  
  useEffect(() => {
    // Only redirect if auth check is complete, not authenticated, and not already redirecting
    if (!loading && !waitingForAuth && !isAuthenticated && !redirecting) {
      setRedirecting(true);
      router.push('/login');
    }
  }, [loading, isAuthenticated, user, router, redirecting, waitingForAuth]);

  // Show loading if still checking auth or waiting for auth
  if (loading || waitingForAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;