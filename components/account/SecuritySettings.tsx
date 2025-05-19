'use client';

import { FaShieldAlt, FaKey } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

interface SecuritySettingsProps {
	onUserDownload: () => Promise<void>;
}

const SecuritySettings = ({ onUserDownload }: SecuritySettingsProps) => {
	// Common classes
	const sectionHeaderClasses =
		'text-md font-medium text-gray-900 dark:text-white mb-4';
	const sectionDescriptionClasses = 'text-gray-600 dark:text-gray-400 mb-4';
	const sectionDividerClasses =
		'border-t border-gray-200 dark:border-gray-700 pt-6';

	// Form input classes
	const inputGroupClasses = 'group';
	const inputLabelClasses =
		'block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200';
	const inputFieldClasses =
		'w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600';
	// Button classes
	const greenButtonClasses =
		'bg-white dark:bg-gray-900 border border-green-500 text-green-600 dark:text-green-500 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-colors duration-200 shadow-sm hover:shadow-md';
	// const redButtonClasses = "border border-red-500 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors duration-200";
	const iconClasses = 'mr-2 h-4 w-4';

	// // Session card classes
	// const sessionCardClasses = "p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50";
	// const sessionCardTitleClasses = "font-medium text-gray-900 dark:text-white";
	// const activeBadgeClasses = "px-2 py-1 text-xs text-green-700 bg-green-50 dark:text-green-300 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800";
	return (
		<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 mb-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
			<h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
				<FaShieldAlt className='mr-3 h-5 w-5 text-green-600 dark:text-green-500' />
				Security Settings
			</h2>

			<div className='space-y-8'>
				<div>
					<h3 className={sectionHeaderClasses}>Change Password</h3>
					<div className='space-y-4'>
						<div className={inputGroupClasses}>
							<label htmlFor='currentPassword' className={inputLabelClasses}>
								Current Password
							</label>
							<input
								type='password'
								id='currentPassword'
								name='currentPassword'
								className={inputFieldClasses}
							/>
						</div>

						<div className={inputGroupClasses}>
							<label htmlFor='newPassword' className={inputLabelClasses}>
								New Password
							</label>
							<input
								type='password'
								id='newPassword'
								name='newPassword'
								className={inputFieldClasses}
							/>
						</div>

						<div className={inputGroupClasses}>
							<label htmlFor='confirmPassword' className={inputLabelClasses}>
								Confirm New Password
							</label>
							<input
								type='password'
								id='confirmPassword'
								name='confirmPassword'
								className={inputFieldClasses}
							/>
						</div>
					</div>

					<div className='flex justify-end mt-5'>
						<Button variant='outline' className={greenButtonClasses}>
							<FaKey className={iconClasses} />
							Change Password
						</Button>
					</div>
				</div>
				{/* 
				<div className={sectionDividerClasses}>
					<h3 className={sectionHeaderClasses}>
						Login Sessions
					</h3>
					<p className={sectionDescriptionClasses}>
						Manage your active login sessions. If you notice any
						suspicious activity, log out of all devices immediately.
					</p>

					<div className="space-y-4">
						<div className={sessionCardClasses}>
							<div className="flex justify-between items-center">
								<div>
									<p className={sessionCardTitleClasses}>
										Current Session
									</p>
								</div>
								<span className={activeBadgeClasses}>
									Active
								</span>
							</div>
						</div>
					</div>

					<div className="mt-5">
						<Button
							variant="outline"
							className={redButtonClasses}
							onClick={async () => {
								await logout()
							}}
						>
							Log Out All Devices
						</Button>
					</div>
				</div> */}

				<div className={sectionDividerClasses}>
					<h3 className={sectionHeaderClasses}>Download Your Data</h3>
					<p className={sectionDescriptionClasses}>
						You can download a copy of your data for your records. This includes
						your profile information, listings, and messages.
					</p>

					<div className='flex justify-start'>
						<Button
							variant='outline'
							className={greenButtonClasses}
							onClick={onUserDownload}
						>
							<FaKey className={iconClasses} />
							Download Data
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SecuritySettings;
