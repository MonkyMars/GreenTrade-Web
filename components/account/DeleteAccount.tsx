'use client';

import { useState } from 'react';
import { FaTrash, FaExclamationTriangle } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { AnimatePresence } from 'framer-motion';

interface DeleteAccountProps {
	handleDeleteAccount: () => Promise<void>;
}

const DeleteAccount: React.FC<DeleteAccountProps> = ({
	handleDeleteAccount,
}) => {
	const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
	const [deleteText, setDeleteText] = useState<string>('');

	const confirmEnabled = deleteText.toLowerCase() === 'delete my account';
	// Common button classes
	const redButtonClasses =
		'bg-white hover:bg-red-600 text-red-600 hover:text-white border border-red-500 dark:bg-gray-900 dark:hover:bg-red-600 dark:text-red-500 dark:hover:text-white dark:border-red-600 transition-colors shadow-sm hover:shadow-md';
	const cancelButtonClasses =
		'border border-gray-300 hover:border-gray-400 text-gray-700 dark:border-gray-700 dark:hover:border-gray-600 dark:text-gray-300 transition-colors shadow-sm hover:shadow-md';
	const iconClasses = 'mr-2 h-4 w-4';

	// Warning box classes
	const warningBoxClasses =
		'p-6 bg-red-50 dark:bg-red-900/10 rounded-md border border-red-200 dark:border-red-900 mb-6';
	const warningIconClasses = 'h-6 w-6 text-red-500 mr-4 mt-0.5 flex-shrink-0';
	const warningTitleClasses =
		'text-md font-semibold text-red-800 dark:text-red-300 mb-3';
	const warningTextClasses = 'text-gray-700 dark:text-gray-300 leading-relaxed';

	// List item classes
	const listItemClasses = 'flex items-center';
	const bulletPointClasses = 'mr-2';
	return (
		<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 mb-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
			<h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
				<FaTrash className='mr-3 h-5 w-5 text-red-500' />
				Delete Account
			</h2>

			<div className={warningBoxClasses}>
				<div className='flex items-start'>
					<FaExclamationTriangle className={warningIconClasses} />
					<div>
						<h3 className={warningTitleClasses}>
							Warning: This action cannot be undone
						</h3>
						<p className={warningTextClasses}>
							Deleting your account will permanently remove all your data,
							including:
						</p>
						<ul className='mt-2 mb-2 space-y-1 text-gray-700 dark:text-gray-300'>
							<li className={listItemClasses}>
								<span className={bulletPointClasses}>•</span> Your personal
								information and profile data
							</li>
							<li className={listItemClasses}>
								<span className={bulletPointClasses}>•</span> All your listings
								and product images
							</li>
							<li className={listItemClasses}>
								<span className={bulletPointClasses}>•</span> Message history
								and conversations
							</li>
							<li className={listItemClasses}>
								<span className={bulletPointClasses}>•</span> Purchase/sale
								history and reviews
							</li>
						</ul>
						<p className='mt-3 text-gray-700 dark:text-gray-300 font-medium'>
							Your account cannot be recovered after deletion.
						</p>
					</div>
				</div>
			</div>

			<AnimatePresence mode='wait'>
				{!showDeleteConfirm ? (
					<div>
						<Button
							variant='outline'
							className={redButtonClasses}
							onClick={() => setShowDeleteConfirm(true)}
						>
							<FaTrash className={iconClasses} />
							Delete My Account
						</Button>
					</div>
				) : (
					<div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
						<h3 className='text-md font-medium text-gray-900 dark:text-white mb-4'>
							Confirm Account Deletion
						</h3>
						<p className='text-gray-600 dark:text-gray-400 mb-4'>
							Please type{' '}
							<strong className='text-red-600 dark:text-red-400 font-medium'>
								delete my account
							</strong>{' '}
							below to confirm:
						</p>

						<div className='mb-6'>
							{' '}
							<input
								type='text'
								value={deleteText}
								onChange={(e) => setDeleteText(e.target.value)}
								className='w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-red-400 dark:hover:border-red-600 shadow-sm'
							/>
						</div>

						<div className='flex justify-between'>
							<Button
								variant='outline'
								className={cancelButtonClasses}
								onClick={() => {
									setShowDeleteConfirm(false);
									setDeleteText('');
								}}
							>
								Cancel
							</Button>
							<Button
								variant='outline'
								className={redButtonClasses}
								disabled={!confirmEnabled}
								onClick={() => handleDeleteAccount()}
							>
								<FaTrash className={iconClasses} />
								Permanently Delete Account
							</Button>
						</div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default DeleteAccount;
