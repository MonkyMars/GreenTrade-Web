'use client';
import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useRef,
	useCallback,
	Suspense,
} from 'react';
import axios from 'axios';
import { User } from '../types/user';
import api from '../backend/api/axiosConfig';
import { getUser } from '@/lib/backend/auth/user';
import { toast } from 'sonner';
import { AppError, handleError, retryOperation } from '@/lib/errorUtils';
import { useSearchParams } from 'next/navigation';

interface AuthContextType {
	user: User | null;
	loading: boolean;
	login: (email: string, password: string) => Promise<void>;
	register: (
		name: string,
		email: string,
		password: string,
		location: string
	) => Promise<void>;
	logout: () => Promise<void>;
	isAuthenticated: boolean;
	refreshTokens: () => Promise<boolean>;
	reloadUser: () => Promise<void>;
	getTokenRemainingTime: () => number | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create a separate component for handling OAuth redirect
const OAuthRedirectHandler: React.FC<{ onUserLoad: (user: User) => void }> = ({
	onUserLoad,
}) => {
	const searchParams = useSearchParams();
	useEffect(() => {
		const handleOAuthRedirect = async () => {
			// Check if the user is redirected from a login or registration page
			const accessToken = searchParams.get('access_token');
			const refreshToken = searchParams.get('refresh_token');
			const userId = searchParams.get('user_id');
			let expiresIn: string | number | null = searchParams.get('expires_in');

			expiresIn = expiresIn ? parseInt(expiresIn) : null;

			if (!userId || !accessToken || !refreshToken || !expiresIn) {
				return;
			}

			localStorage.setItem('userId', userId);

			try {
				const user = await getUser();

				if (!user) {
					throw new AppError('User not found', { code: 'USER_NOT_FOUND' });
				}

				// Update user state - this will trigger navigation due to authentication state change
				onUserLoad(user);
			} catch (error) {
				localStorage.removeItem('userId');

				// Handle common errors and expose appropriate messages for user login experience
				let errorMessage = 'Login failed. Please try again.';

				if (axios.isAxiosError(error)) {
					if (error.response) {
						// Server responded with an error status code
						if (error.response.status === 401) {
							errorMessage = 'Invalid email or password. Please try again.';
						} else if (error.response.data && error.response.data.message) {
							errorMessage = error.response.data.message;
						} else if (error.response.status >= 500) {
							errorMessage = 'Server error. Please try again later.';
						}
					} else if (error.request) {
						// No response received
						errorMessage = 'Network error. Please check your connection.';
					}
				} else if (error instanceof Error) {
					errorMessage = error.message;
				}

				// Log in development, use proper error tracking in production
				if (process.env.NODE_ENV !== 'production') {
					console.error('Login failed:', error);
				}

				// Display error to user via toast
				toast.error(errorMessage);
			} finally {
				// Clear URL parameters to avoid reprocessing
				const url = new URL(window.location.href);
				url.searchParams.delete('access_token');
				url.searchParams.delete('refresh_token');
				url.searchParams.delete('user_id');
				url.searchParams.delete('expires_in');
				window.history.replaceState({}, document.title, url.toString());
			}
		};

		handleOAuthRedirect();
	}, [searchParams, onUserLoad]);

	return null;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [loading, setLoading] = useState(true);
	// Add refs to track refresh state
	const refreshInProgress = useRef(false);
	const refreshAttempts = useRef(0);
	const maxRefreshAttempts = 3;
	const lastRefreshTime = useRef(0);
	const tokenExpirationTime = useRef<number | null>(null);
	const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);

	// Create a ref for the refreshTokens function
	const refreshTokensRef = useRef<() => Promise<boolean>>(null);

	// Forward declare the function type
	const setupTokenRefresh: (expiresIn: number) => void = useCallback(
		(expiresIn: number) => {
			// Convert expiresIn (seconds) to milliseconds and calculate expiration timestamp
			const expirationTime = Date.now() + expiresIn * 1000;
			tokenExpirationTime.current = expirationTime;

			// Clear any existing timer
			if (refreshTimerRef.current) {
				clearTimeout(refreshTimerRef.current);
			}

			// Schedule refresh at 90% of token lifetime
			const refreshDelay = Math.floor(expiresIn * 0.9) * 1000;

			refreshTimerRef.current = setTimeout(() => {
				if (process.env.NODE_ENV !== 'production') {
					console.log('Auto-refreshing token before expiry');
				}
				refreshTokensRef.current?.();
			}, refreshDelay);

			if (process.env.NODE_ENV !== 'production') {
				const refreshDate = new Date(Date.now() + refreshDelay);
				console.log(
					`Token will expire in ${expiresIn}s, refresh scheduled for ${refreshDate.toLocaleTimeString()}`
				);
			}
		},
		[]
	); // No dependencies needed here

	// Function to refresh access token
	const refreshTokens = useCallback(async (): Promise<boolean> => {
		// Prevent concurrent refresh attempts
		if (refreshInProgress.current) {
			if (process.env.NODE_ENV !== 'production') {
				console.log('Token refresh already in progress, skipping...');
			}
			return false;
		}

		// Implement rate limiting
		const now = new Date().getTime();
		const timeSinceLastRefresh = now - lastRefreshTime.current;
		if (lastRefreshTime.current > 0 && timeSinceLastRefresh < 5000) {
			// Increased to 5 seconds
			if (process.env.NODE_ENV !== 'production') {
				console.log(
					`Rate limiting refresh (${timeSinceLastRefresh}ms since last attempt)`
				);
			}
			return false;
		}
		lastRefreshTime.current = now;

		// Check max attempts
		if (refreshAttempts.current >= maxRefreshAttempts) {
			handleError(
				new AppError(
					`Maximum refresh attempts (${maxRefreshAttempts}) reached`,
					{
						code: 'MAX_REFRESH_ATTEMPTS',
					}
				),
				'Authentication'
			);
			// Clear user ID and state since we can't refresh the token anymore
			localStorage.removeItem('userId');
			setUser(null);
			return false;
		}

		// Increment refresh attempts
		refreshAttempts.current += 1;
		refreshInProgress.current = true;

		if (process.env.NODE_ENV !== 'production') {
			console.log(`Attempting token refresh (${refreshAttempts.current})`);
		}

		// Set a loading state for the refresh operation
		setLoading(true);

		try {
			// Use our retry operation for the API call
			const response = await retryOperation(() => api.post(`/auth/refresh`), {
				maxRetries: 2,
				delayMs: 1000,
				context: 'Token refresh',
			});

			// Match your backend response structure - we only need userId with HTTP-only cookies
			const { userId, expiresIn } = response.data.data;

			if (!userId) {
				throw new AppError('Invalid refresh token response', {
					code: 'INVALID_TOKEN_RESPONSE',
				});
			}

			// Store the user ID
			localStorage.setItem('userId', userId);
			// Store expiration time and schedule refresh
			if (expiresIn) {
				setupTokenRefresh(expiresIn);
			}

			if (process.env.NODE_ENV !== 'production') {
				console.log('Token refresh successful');
			}
			// Reset attempt counter on success
			refreshAttempts.current = 0;

			return true;
		} catch (error) {
			// Use our properly typed handleError helper
			handleError(error, 'Token refresh failed');

			// Progressive backoff on failures
			await new Promise((resolve) =>
				setTimeout(resolve, Math.min(1000 * refreshAttempts.current, 5000))
			);

			// Only clear auth state after max attempts
			if (refreshAttempts.current >= maxRefreshAttempts) {
				if (process.env.NODE_ENV !== 'production') {
					console.log('Max refresh attempts reached, logging out');
				}
				// We only keep userId in localStorage now
				localStorage.removeItem('userId');

				setUser(null);

				// Notify user of session expiration
				toast.error('Your session has expired. Please log in again.');
			}

			return false;
		} finally {
			refreshInProgress.current = false;
			setLoading(false);
		}
	}, [setupTokenRefresh]);

	// Fix the axios interceptor to handle authentication errors
	useEffect(() => {
		const interceptor = api.interceptors.response.use(
			(response) => response,
			async (error) => {
				const originalRequest = error.config;

				// Prevent infinite retry loops - check retry flag and status code
				if (
					error.response?.status === 401 &&
					!originalRequest._retry &&
					refreshAttempts.current < maxRefreshAttempts
				) {
					originalRequest._retry = true;

					try {
						if (process.env.NODE_ENV !== 'production') {
							console.log('401 error detected, attempting token refresh');
						}

						// Try to refresh the cookie-based token
						const refreshSuccess = await refreshTokens();

						if (refreshSuccess) {
							// With cookie-based auth, we just need to retry the original request
							// The cookies will be automatically sent with the request
							await new Promise((resolve) => setTimeout(resolve, 50));

							// Return the retried request
							return api(originalRequest);
						} else {
							if (process.env.NODE_ENV !== 'production') {
								console.log('Token refresh failed, rejecting original request');
							}
						}
					} catch (refreshError) {
						handleError(refreshError, 'Authentication refresh');
					}
				}

				return Promise.reject(error);
			}
		);

		// Clean up interceptor on unmount
		return () => {
			api.interceptors.response.eject(interceptor);
		};
	}, [refreshTokens]);

	// Clean up the refresh timer on unmount
	useEffect(() => {
		return () => {
			if (refreshTimerRef.current) {
				clearTimeout(refreshTimerRef.current);
			}
		};
	}, []);

	// Check if user is logged in on initial load
	useEffect(() => {
		const checkAuthStatus = async () => {
			try {
				// Fetch user data to check authentication status
				// The cookies will be automatically sent with the request
				// We only need to check if we have a userId stored
				const userId = localStorage.getItem('userId');
				if (!userId) {
					setLoading(false);
					return;
				}

				// Make a request to validate auth status
				// This will use the HTTP cookies automatically
				try {
					// Use retry operation for API call
					const response = await retryOperation(() => api.get(`/api/auth/me`), {
						maxRetries: 3,
						delayMs: 1000,
						context: 'User authentication',
					});

					if (!response.data.success) {
						throw new AppError('Failed to fetch user data', {
							code: 'USER_FETCH_FAILED',
						});
					}

					setUser(response.data.data.user);
				} catch (apiError) {
					// If retries fail, handle it gracefully
					handleError(apiError, 'Authentication validation');
					throw apiError; // Rethrow to trigger the catch block below
				}
			} catch (error) {
				// Clear user ID on authentication error
				if (process.env.NODE_ENV !== 'production') {
					console.error('Authentication error:', error);
				}
				localStorage.removeItem('userId');
			} finally {
				setLoading(false);
			}
		};

		checkAuthStatus();
	}, [refreshTokens]);

	// Handle user update from OAuth redirect
	const handleSetUser = (newUser: User) => {
		setUser(newUser);
	};

	// Login function
	const login = async (email: string, password: string) => {
		// Don't set global loading state to true here
		// This allows the login component to control its own loading state
		try {
			if (process.env.NODE_ENV !== 'production') {
				console.log('Attempting login for:', email);
			}

			// Use retry operation for API call
			const response = await retryOperation(
				() => api.post(`/auth/login`, { email, password }),
				{
					maxRetries: 2,
					delayMs: 800,
					context: 'Login attempt',
				}
			);

			// Check if the response has an error message
			if (!response.data.success) {
				throw new AppError(response.data.message || 'Login failed', {
					code: 'LOGIN_FAILED',
				});
			}

			if (!response.data || !response.data.data) {
				throw new AppError('Invalid login response format', {
					code: 'INVALID_RESPONSE_FORMAT',
				});
			} // With HTTP-only cookies we only need the userId and token expiration
			const { userId, expiresIn } = response.data.data;

			if (!userId) {
				throw new AppError('Missing user ID in response', {
					code: 'USER_ID_MISSING',
				});
			}

			// Store only the user ID in localStorage
			localStorage.setItem('userId', userId);

			// Handle token expiration for automatic refresh
			if (expiresIn) {
				setupTokenRefresh(expiresIn);
			}

			// Set user data
			const user = await getUser();

			if (!user) {
				throw new AppError('User not found', { code: 'USER_NOT_FOUND' });
			}

			// Update user state - this will trigger navigation due to authentication state change
			setUser(user);

			// Show success message
			toast.success(`Logged in successfully as ${user.name}!`);
		} catch (error) {
			// Handle error and clean up any partial auth state
			localStorage.removeItem('userId');

			// Handle common errors and expose appropriate messages for user login experience
			let errorMessage = 'Login failed. Please try again.';

			if (axios.isAxiosError(error)) {
				if (error.response) {
					// Server responded with an error status code
					if (error.response.status === 401) {
						errorMessage = 'Invalid email or password. Please try again.';
					} else if (error.response.data && error.response.data.message) {
						errorMessage = error.response.data.message;
					} else if (error.response.status >= 500) {
						errorMessage = 'Server error. Please try again later.';
					}
				} else if (error.request) {
					// No response received
					errorMessage = 'Network error. Please check your connection.';
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			// Log in development, use proper error tracking in production
			if (process.env.NODE_ENV !== 'production') {
				console.error('Login failed:', error);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(error);
			}

			// Display error to user via toast
			toast.error(errorMessage);

			// Rethrow for component handling with standardized message
			throw new Error(errorMessage);
		}
	};

	// Register function
	const register = async (
		name: string,
		email: string,
		password: string,
		location: string
	) => {
		try {
			setLoading(true);

			// Use retry operation for API call
			const response = await retryOperation(
				() =>
					api.post(`/auth/register`, {
						name,
						email,
						password,
						location,
					}),
				{
					maxRetries: 2, // Fewer retries for registration
					delayMs: 800,
					context: 'Account registration',
				}
			);

			if (!response.data.success) {
				throw new AppError(response.data.message || 'Registration failed', {
					code: 'REGISTRATION_FAILED',
				});
			}
			const { userId, expiresIn } = response.data.data;

			if (!userId) {
				throw new AppError('Missing user ID in response', {
					code: 'USER_ID_MISSING',
				});
			}

			// Store only the user ID in localStorage
			localStorage.setItem('userId', userId);

			// Handle token expiration for automatic refresh
			if (expiresIn) {
				setupTokenRefresh(expiresIn);
			}

			// Set user data
			const user = await getUser();

			if (!user) {
				throw new AppError('User not found', { code: 'USER_NOT_FOUND' });
			}

			setUser(user);

			// Show success message
			toast.success('Registration successful! Welcome to GreenVue.');
		} catch (error) {
			// Handle common registration errors
			let errorMessage = 'Registration failed. Please try again.';

			if (axios.isAxiosError(error)) {
				if (error.response) {
					if (error.response.status === 409) {
						errorMessage =
							'Email already exists. Please use a different email address.';
					} else if (error.response.data?.message) {
						errorMessage = error.response.data.message;
					} else if (error.response.status >= 500) {
						errorMessage = 'Server error. Please try again later.';
					}
				} else if (error.request) {
					errorMessage =
						'Network error. Please check your connection and try again.';
				}
			} else if (error instanceof Error) {
				errorMessage = error.message;
			}

			// Log in development, use proper error tracking in production
			if (process.env.NODE_ENV !== 'production') {
				console.error('Registration failed:', error);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(error);
			}

			// Display error to user via toast
			toast.error(errorMessage);

			// Rethrow for component handling
			throw new Error(errorMessage);
		} finally {
			setLoading(false);
		}
	};

	// Logout function
	const logout = async () => {
		if (process.env.NODE_ENV !== 'production') {
			console.log('Logging out user');
		}

		try {
			// Reset refresh attempts and tracking
			refreshAttempts.current = 0;
			refreshInProgress.current = false;
			lastRefreshTime.current = 0;

			// Clear token expiration time and cancel any scheduled refresh
			tokenExpirationTime.current = null;
			if (refreshTimerRef.current) {
				clearTimeout(refreshTimerRef.current);
				refreshTimerRef.current = null;
			}

			// Call the logout endpoint to clear cookies on the server
			await api.post('/auth/logout');

			// Clear stored user ID
			localStorage.removeItem('userId');

			// Clear user state
			setUser(null);

			// Notify user of successful logout
			toast.success('You have been successfully logged out.');
		} catch (error) {
			// For logout, even if there's an error, we still want to clear local state
			// so a failed logout doesn't leave the user in a broken authentication state
			localStorage.removeItem('userId');
			setUser(null);

			// Log the error but don't display to user since we're still clearing their session
			if (process.env.NODE_ENV !== 'production') {
				console.error('Logout error:', error);
			} else {
				// In production, this would use a service like Sentry
				// Example: Sentry.captureException(error);
			}
		}
	};

	const reloadUser = async () => {
		setLoading(true);
		try {
			const userId = localStorage.getItem('userId');
			if (!userId) {
				throw new AppError('User ID not found', { code: 'USER_ID_MISSING' });
			}

			// Use retry operation for API call
			const response = await retryOperation(() => api.get(`/api/auth/me`), {
				maxRetries: 3,
				delayMs: 800,
				context: 'User profile refresh',
			});

			if (!response.data.success) {
				throw new AppError('Failed to fetch user data', {
					code: 'USER_FETCH_FAILED',
				});
			}

			setUser(response.data.data.user);
		} catch (error) {
			// Handle error with our helper
			handleError(error, 'Profile reload');
		} finally {
			setLoading(false);
		}
	};

	// Get remaining time until token expiration
	const getTokenRemainingTime = () => {
		if (!tokenExpirationTime.current) {
			return null;
		}

		const remainingTime = tokenExpirationTime.current - Date.now();
		return remainingTime > 0 ? Math.floor(remainingTime / 1000) : 0; // Return in seconds
	};

	return (
		<AuthContext.Provider
			value={{
				user,
				loading,
				login,
				register,
				logout,
				isAuthenticated: !!user,
				refreshTokens,
				reloadUser,
				getTokenRemainingTime,
			}}
		>
			{/* Wrap the OAuth handler in a Suspense boundary */}
			<Suspense fallback={null}>
				<OAuthRedirectHandler onUserLoad={handleSetUser} />
			</Suspense>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (context === undefined) {
		throw new Error('useAuth must be used within an AuthProvider');
	}
	return context;
};
