'use client';

import { User } from '@/lib/types/user';
import {
	FaUser,
	FaStore,
	FaShieldAlt,
	FaTrash,
	FaSignOutAlt,
} from 'react-icons/fa';
import { cn } from '@/lib/functions/cn';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ProfileSidebarProps {
	user: User | null;
	activeTab: 'profile' | 'seller' | 'security' | 'delete';
	setActiveTab: (tab: 'profile' | 'seller' | 'security' | 'delete') => void;
	handleLogout: () => void;
	userListingsCount: number;
	averageEcoScore: number;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
	user,
	activeTab,
	setActiveTab,
	handleLogout,
	userListingsCount,
	averageEcoScore,
}) => {
	/* Common button classes */
	const baseButtonClasses =
		'w-full relative justify-start transition-all duration-200 rounded-md px-3 py-2 text-sm font-medium';

	/* Green button states */
	const activeGreenButtonClasses =
		'bg-green-50 text-green-600 dark:bg-green-950 dark:text-green-400 shadow-sm';
	const inactiveGreenButtonClasses =
		'text-gray-600 dark:text-gray-400 hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-950 dark:hover:text-green-400';

	// Red button states
	const activeRedButtonClasses =
		'bg-red-50 border-red-500 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-400';
	const inactiveRedButtonClasses =
		'hover:border-red-200 hover:bg-red-50 dark:hover:border-red-800 dark:hover:bg-red-950 text-red-600 dark:text-red-500';
	// Icon classes
	const baseIconClasses = 'mr-3 h-4 w-4';
	const greenIconClasses = cn(
		baseIconClasses,
		'text-green-600 dark:text-green-500'
	);
	const redIconClasses = cn(baseIconClasses, 'text-red-600 dark:text-red-500');

	// Summary item classes
	const summaryItemClasses = 'flex justify-between text-sm items-center';
	const summaryLabelClasses = 'text-gray-600 dark:text-gray-400';
	const summaryValueClasses =
		'font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded';
	const ecoScoreClasses =
		'font-medium border border-green-200 dark:border-green-900 bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded';
	return (
		<div className='md:w-72 flex-shrink-0 space-y-4'>
			<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
				<div className='flex flex-col items-center'>
					<div className='relative h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden mb-4'>
						<Avatar user={user} />
					</div>

					<h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-1'>
						{user?.name || 'Loading...'}
					</h2>

					<p className='text-gray-600 dark:text-gray-400 mb-4 text-sm'>
						{user?.email || ''}
					</p>

					{userListingsCount > 0 && (
						<Badge className='mb-4 bg-green-50 text-green-800 dark:bg-green-900/30 dark:text-green-200 border border-green-200 dark:border-green-800 px-3 py-1'>
							<FaStore className='mr-2 h-3 w-3' />
							Seller
						</Badge>
					)}

					<div className='w-full mt-3 space-y-2'>
						<Button
							variant='outline'
							className={cn(
								baseButtonClasses,
								'border-none',
								activeTab === 'profile'
									? activeGreenButtonClasses
									: inactiveGreenButtonClasses
							)}
							onClick={() => setActiveTab('profile')}
						>
							<FaUser className={greenIconClasses} />
							Profile
						</Button>

						<Button
							variant='outline'
							className={cn(
								baseButtonClasses,
								'border-none',
								activeTab === 'security'
									? activeGreenButtonClasses
									: inactiveGreenButtonClasses
							)}
							onClick={() => setActiveTab('security')}
						>
							<FaShieldAlt className={greenIconClasses} />
							Security
						</Button>

						{/* Seperator */}
						<div className='border-t border-gray-200 dark:border-gray-800' />

						<Button
							variant='outline'
							className={cn(
								baseButtonClasses,
								'mt-2 border-none',
								activeTab === 'delete'
									? activeRedButtonClasses
									: inactiveRedButtonClasses
							)}
							onClick={() => setActiveTab('delete')}
						>
							<FaTrash className={redIconClasses} />
							Delete Account
						</Button>

						<Button
							variant='outline'
							className={cn(
								baseButtonClasses,
								'border-none',
								inactiveRedButtonClasses
							)}
							onClick={handleLogout}
						>
							<FaSignOutAlt className='mr-3 h-4 w-4 text-red-500' />
							Log Out
						</Button>
					</div>
				</div>
			</div>{' '}
			<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
				<h3 className='text-sm font-medium text-gray-900 dark:text-white mb-4 flex items-center'>
					<span className='mr-2 text-green-600 dark:text-green-500'>•</span>
					Account Summary
				</h3>

				<div className='space-y-4'>
					<div className={summaryItemClasses}>
						<span className={summaryLabelClasses}>Member since</span>
						<span className={summaryValueClasses}>
							{new Date(user?.createdAt || Date.now()).toLocaleDateString()}
						</span>
					</div>

					<div className={summaryItemClasses}>
						<span className={summaryLabelClasses}>Listings</span>
						<span className={summaryValueClasses}>
							{userListingsCount || 0}
						</span>
					</div>

					{userListingsCount > 0 && (
						<div className={summaryItemClasses}>
							<span className={summaryLabelClasses}>Eco Score</span>
							<span className={ecoScoreClasses}>{averageEcoScore}/5</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default ProfileSidebar;
