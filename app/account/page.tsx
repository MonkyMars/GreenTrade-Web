'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types/user';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getSellerListings } from '@/lib/backend/listings/getListings';
import { calculateAverageEcoScore } from '@/lib/functions/calculateEcoScore';
import { getReviews } from '@/lib/backend/reviews/getReviews';
import api from '@/lib/backend/api/axiosConfig';
import { NextPage } from 'next';
import { motion, AnimatePresence } from 'framer-motion';

// Import new modular components
import ProfileSidebar from '@/components/account/ProfileSidebar';
import ProfileInfo from '@/components/account/ProfileInfo';
import SecuritySettings from '@/components/account/SecuritySettings';
import DeleteAccount from '@/components/account/DeleteAccount';
import ActivityTabs from '@/components/account/ActivityTabs';
import { AppError } from '@/lib/errorUtils';
import { getFavorites } from '@/lib/backend/favorites/getFavorites';
import { fetchCountriesInEurope } from '@/lib/functions/countries';
import { useQuery } from '@tanstack/react-query';

interface ActiveTab {
	activeTab: 'profile' | 'seller' | 'security' | 'delete';
}

const AccountPage: NextPage = () => {
	const router = useRouter();
	const {
		user: authUser,
		logout,
		loading: authLoading,
		isAuthenticated,
	} = useAuth();
	const [user, setUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState<ActiveTab['activeTab']>('profile');
	const [updateSuccess, setUpdateSuccess] = useState<string>('');
	const [disabled, setDisabled] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	// Update user data when auth state changes
	useEffect(() => {
		if (!authLoading) {
			if (authUser) {
				setUser(authUser);
			}
		}
	}, [authUser, authLoading, isAuthenticated]);
	// We removed the "Update user location" effect as it was causing an infinite loop

	// Handle logout
	const handleLogout = async () => {
		await logout();
	};

	// Handle account deletion
	const handleDeleteAccount = async () => {
		try {
			const response = await api.delete('/api/auth/delete');

			if (!response.data.success) {
				throw new Error('Failed to delete account');
			}

			await logout();
			router.push('/?deleted=true');
		} catch (error) {
			console.error('Error deleting account:', error);
		}
	};

	// Fetch user listings and reviews
	// Use React Query for fetching user data
	const { data: userListings = [] } = useQuery({
		queryKey: ['userListings', user?.id],
		queryFn: () => getSellerListings(user!.id),
		enabled: !!user?.id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const { data: userReviews = [] } = useQuery({
		queryKey: ['userReviews', user?.id],
		queryFn: () => getReviews(user!.id),
		enabled: !!user?.id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	const { data: userFavorites = [] } = useQuery({
		queryKey: ['userFavorites', user?.id],
		queryFn: () => getFavorites(),
		enabled: !!user?.id,
		staleTime: 5 * 60 * 1000, // 5 minutes
	});

	// Handle user data update
	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();

		// Clear previous messages
		setError(null);
		setUpdateSuccess('');

		if (!user) return;

		const form = e.target as HTMLFormElement;
		const formData = new FormData(form);

		// Extract form values
		const name = (formData.get('name') as string)?.trim();
		const bio = (formData.get('bio') as string)?.trim();
		const city = (formData.get('city') as string)?.trim();
		const country = (formData.get('country') as string)?.trim();

		const errors: string[] = [];

		// Name validations
		if (!name) {
			errors.push('Name is required');
		} else {
			if (name.length < 2)
				errors.push('Name must be at least 2 characters long');
			if (name.length > 40) errors.push('Name cannot exceed 40 characters');
			if (!/^[a-zA-Z\s.]+$/.test(name))
				errors.push('Name can only contain letters, spaces, and periods');
		}

		// Bio validations
		if (bio) {
			if (bio.length < 10)
				errors.push('Bio must be at least 10 characters long');
			if (bio.length > 500) errors.push('Bio cannot exceed 500 characters');
			if (!/^[a-zA-Z0-9\s.,!?'"-]*$/.test(bio)) {
				errors.push(
					'Bio can only contain letters, numbers, spaces, and basic punctuation'
				);
			}
		}

		// City validations
		if (city) {
			if (city.length < 2)
				errors.push('City must be at least 2 characters long');
			if (city.length > 50) errors.push('City cannot exceed 50 characters');
			if (!/^[a-zA-Z\s.'-]+$/.test(city)) {
				errors.push(
					'City can only contain letters, spaces, periods, and hyphens'
				);
			}
		}

		// Country validations
		if (country) {
			if (country.length < 2)
				errors.push('Country must be at least 2 characters long');
			if (country.length > 50) errors.push('Country cannot exceed 50 characters');
			if (!/^[a-zA-Z\s.'-]+$/.test(country)) {
				errors.push(
					'Country can only contain letters, spaces, periods, and hyphens'
				);
			}
		}

		// Country validation
		try {
			const countries = fetchCountriesInEurope();
			const isValidCountry = countries.some(
				(countryObj) => countryObj.name.toLowerCase() === country.toLowerCase()
			);

			if (country && !isValidCountry) {
				errors.push('Please select a valid country from the list');
			}
		} catch (err) {
			console.error('Error fetching countries:', err);
			errors.push('Error validating country');
		}

		// Stop if there are any validation errors
		if (errors.length > 0) {
			setError(errors.join('\n  - '));
			return;
		}

		// Construct request body using updated values or fallbacks
		const updatedUserData = {
			id: user.id,
			name,
			bio: bio || '',
			location: {
				city: city || user.location?.city || '',
				country: country || user.location?.country || '',
			},
		};

		try {
			const response = await api.patch(`/api/auth/user`, updatedUserData);

			if (!response.data.success) {
				setError(response.data.message || 'Failed to update user data');
				throw new Error(response.data.message || 'Failed to update user data');
			}

			setUpdateSuccess('User data updated successfully!');
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		} catch (error: any) {
			setError(
				error.response?.data?.message ||
				'An error occurred while updating user data'
			);
			if (process.env.NODE_ENV !== 'production') {
				console.error('Error updating user data:', error);
			}
		}
	};

	// Update disabled state for Save button
	useEffect(() => {
		if (!user || !authUser) return;

		const isSameUser =
			user.id === authUser.id &&
			user.name === authUser.name &&
			user.email === authUser.email &&
			user.location === authUser.location &&
			user.bio === authUser.bio;

		setDisabled(isSameUser);
	}, [user, authUser]);

	// Calculate average eco score
	const averageEcoScore =
		userListings.length > 0
			? Number(calculateAverageEcoScore(userListings))
			: 0;

	// Common animation props
	const tabAnimationProps = {
		initial: { opacity: 0 },
		animate: { opacity: 1 },
		exit: { opacity: 0 },
		transition: { duration: 0.3 },
	};

	const onUserDownload = async () => {
		try {
			// Make the API request
			const response = await api.get('/api/auth/download_user_data', {
				responseType: 'json',
			});

			// Check if the response is valid
			if (!response.data || !response.data.data) {
				throw new Error('Invalid response format');
			}

			// Convert the response data to a JSON string
			const jsonData = JSON.stringify(response.data.data, null, 2);

			// Create a blob with the JSON data
			const blob = new Blob([jsonData], { type: 'application/json' });

			// Create a download link
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `${user?.name || 'user_data'}.json`;

			// Trigger the download
			document.body.appendChild(a);
			a.click();

			// Clean up
			a.remove();
			window.URL.revokeObjectURL(url);
		} catch (error) {
			if (process.env.NODE_ENV !== 'production') {
				console.error('Download error:', error);
			}
			throw new AppError('Failed to download user data: ' + error);
		}
	};

	return (
		<ProtectedRoute>
			<div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-16'>
				<div className='container mx-auto px-4 py-8'>
					<div className='flex flex-col md:flex-row gap-6'>
						<ProfileSidebar
							user={user}
							activeTab={activeTab}
							setActiveTab={setActiveTab}
							handleLogout={handleLogout}
							userListingsCount={userListings.length}
							averageEcoScore={averageEcoScore}
						/>

						<div className='flex-1'>
							<AnimatePresence mode='wait'>
								{activeTab === 'profile' && (
									<motion.div
										key='profile'
										{...tabAnimationProps}
										className='space-y-6'
									>
										<ProfileInfo
											user={user}
											handleUpdateUser={handleUpdateUser}
											updateSuccess={updateSuccess}
											error={error}
											setError={setError}
											setUpdateSuccess={setUpdateSuccess}
											setUser={setUser}
											disabled={disabled}
										/>

										<ActivityTabs
											userListings={userListings}
											userReviews={userReviews}
											userFavorites={userFavorites}
										/>
									</motion.div>
								)}

								{activeTab === 'security' && (
									<motion.div key='security' {...tabAnimationProps}>
										<SecuritySettings onUserDownload={onUserDownload} user={user} />
									</motion.div>
								)}

								{activeTab === 'delete' && (
									<motion.div key='delete' {...tabAnimationProps}>
										<DeleteAccount handleDeleteAccount={handleDeleteAccount} />
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					</div>
				</div>
			</div>
		</ProtectedRoute>
	);
};

export default AccountPage;
