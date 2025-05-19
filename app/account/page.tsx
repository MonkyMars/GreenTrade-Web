'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { User } from '@/lib/types/user';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/lib/contexts/AuthContext';
import { getSellerListings } from '@/lib/backend/listings/getListings';
import { FetchedListing } from '@/lib/types/main';
import { calculateAverageEcoScore } from '@/lib/functions/calculateEcoScore';
import { getReviews } from '@/lib/backend/reviews/getReviews';
import { FetchedReview } from '@/lib/types/review';
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

	const [location, setLocation] = useState<{ city: string; country: string }>({
		city: '',
		country: '',
	});
	const [user, setUser] = useState<User | null>(null);
	const [activeTab, setActiveTab] = useState<ActiveTab['activeTab']>('profile');
	const [updateSuccess, setUpdateSuccess] = useState<string>('');
	const [userListings, setUserListings] = useState<FetchedListing[]>([]);
	const [userReviews, setUserReviews] = useState<FetchedReview[]>([]);
	const [disabled, setDisabled] = useState<boolean>(false);

	// Initialize location from user data
	useEffect(() => {
		if (authUser?.location) {
			const [cityPart = '', countryPart = ''] = authUser.location.split(', ');
			if (cityPart || countryPart) {
				setLocation({
					city: cityPart,
					country: countryPart,
				});
			}
		}
	}, [authUser?.location]);

	// Update user data when auth state changes
	useEffect(() => {
		if (!authLoading) {
			if (authUser) {
				const cityFromAuth = authUser.location?.split(', ')[0] || '';
				const countryFromAuth = authUser.location?.split(', ')[1] || '';

				setLocation({
					city: cityFromAuth,
					country: countryFromAuth,
				});

				setUser(authUser);
			}
		}
	}, [authUser, authLoading, isAuthenticated]);
	// Update user location when city/country change
	useEffect(() => {
		if (!location.city || !location.country) return;
		if (!user) return;

		setUser((prevUser) => {
			if (!prevUser) return prevUser;

			const newLocation = `${location.city}, ${location.country}`;
			if (prevUser.location === newLocation) return prevUser;

			return {
				...prevUser,
				location: newLocation,
			};
		});
	}, [location.city, location.country, user]);

	// Handle logout
	const handleLogout = async () => {
		logout();
	};

	// Handle account deletion
	const handleDeleteAccount = async () => {
		try {
			const response = await api.delete('/user/delete');

			if (!response.data.success) {
				throw new Error('Failed to delete account');
			}

			logout();
			router.push('/?deleted=true');
		} catch (error) {
			console.error('Error deleting account:', error);
		}
	};

	// Fetch user listings and reviews
	useEffect(() => {
		if (!user?.id) return;

		const fetchUserListings = async () => {
			try {
				const data = await getSellerListings(user.id);
				if (data.length > 0) {
					setUserListings(data);
				}
			} catch (error) {
				console.error('Error fetching user listings:', error);
			}
		};

		const fetchUserReviews = async () => {
			try {
				const data = await getReviews(user.id);
				if (data.length > 0) {
					setUserReviews(data);
				}
			} catch (error) {
				console.error('Error fetching user reviews:', error);
			}
		};

		fetchUserListings();
		fetchUserReviews();
	}, [user?.id]);

	// Handle user data update
	const handleUpdateUser = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!user) return;

		const form = e.target as HTMLFormElement;
		const nameInput = form.querySelector('#name') as HTMLInputElement;
		const bioTextarea = form.querySelector('#bio') as HTMLTextAreaElement;

		const body = {
			id: user.id,
			name: nameInput.value,
			bio: bioTextarea.value || '',
			location: `${location.city}, ${location.country}`,
		};

		try {
			const response = await api.patch(`/api/auth/me`, body);

			if (!response.data.success) {
				throw new Error('Failed to update user data');
			}

			const { id, name, bio, location } = response.data.data;

			// Update user state with the new data
			setUser((prevUser) => {
				if (!prevUser) return prevUser;
				return {
					...prevUser,
					id,
					name,
					bio,
					location,
				} as User;
			});

			setUpdateSuccess('User data updated successfully!');
		} catch (error) {
			console.error('Error updating user data:', error);
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
	}, [user, authUser]); // Calculate average eco score
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

			console.log('User data downloaded successfully');
		} catch (error) {
			console.error('Download error:', error);
			throw new AppError('Failed to download user data: ' + error);
		}
	};

	return (
		<ProtectedRoute>
			{' '}
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
											setUpdateSuccess={setUpdateSuccess}
											location={location}
											setLocation={setLocation}
											disabled={disabled}
										/>

										<ActivityTabs
											userListings={userListings}
											userReviews={userReviews}
										/>
									</motion.div>
								)}

								{activeTab === 'security' && (
									<motion.div key='security' {...tabAnimationProps}>
										<SecuritySettings onUserDownload={onUserDownload} />
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
