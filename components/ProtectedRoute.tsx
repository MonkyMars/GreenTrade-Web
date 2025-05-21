import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '@/lib/contexts/AuthContext';

interface ProtectedRouteProps {
	children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
	const { loading, isAuthenticated } = useAuth();
	const router = useRouter();

	useEffect(() => {
		// Check if user is authenticated and redirect if not
		if (!loading && !isAuthenticated) {
			const path = window.location.pathname;
			router.push(`/login?redirect=${path}`);
		}
	}, [loading, isAuthenticated, router]);

	// Show loading if still checking auth
	if (loading) {
		return (
			<div className='min-h-screen flex items-center justify-center'>
				<div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500'></div>
			</div>
		);
	}

	return isAuthenticated ? <>{children}</> : null;
};

export default ProtectedRoute;
