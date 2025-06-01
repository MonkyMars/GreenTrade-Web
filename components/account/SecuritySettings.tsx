'use client';

import { useState, useEffect } from 'react';
import { FaShieldAlt, FaKey } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { sendResetPasswordEmail } from '@/lib/backend/email/resetPassword';
import { toast } from 'sonner';
import { User } from '@/lib/types/user';
import { capitalizeFirstLetter } from '@/lib/functions/capitalization';

interface SecuritySettingsProps {
	onUserDownload: () => Promise<void>;
	user: User | null;
}

const SecuritySettings = ({ onUserDownload, user }: SecuritySettingsProps) => {
	const [lastResetEmailTime, setLastResetEmailTime] = useState<number | null>(null);
	const [resetCooldown, setResetCooldown] = useState<number>(0);
	const [canResetPassword, setCanResetPassword] = useState<boolean>(true);
	// Rate limiting constants
	const RESET_EMAIL_COOLDOWN_MS = 60 * 60 * 1000; // 1 hour in milliseconds

	// Load last reset time from localStorage on component mount
	useEffect(() => {
		if (user) {
			const storageKey = `resetEmail_${user.email}`;
			const storedTime = localStorage.getItem(storageKey);
			if (storedTime) {
				const lastTime = parseInt(storedTime, 10);
				setLastResetEmailTime(lastTime);

				// Calculate remaining cooldown
				const now = Date.now();
				const timeSinceLastReset = now - lastTime;
				if (timeSinceLastReset < RESET_EMAIL_COOLDOWN_MS) {
					const remainingCooldown = Math.ceil((RESET_EMAIL_COOLDOWN_MS - timeSinceLastReset) / 1000);
					setResetCooldown(remainingCooldown);
				}
			}
		}
	}, [user, RESET_EMAIL_COOLDOWN_MS]);

	useEffect(() => {
		if (!user) return;

		// Check user provider
		if (user.provider === 'email') {
			setCanResetPassword(true);
		} else {
			setCanResetPassword(false);
		}
	}, [user])

	// Cooldown timer effect
	useEffect(() => {
		let interval: NodeJS.Timeout | null = null;

		if (resetCooldown > 0) {
			interval = setInterval(() => {
				setResetCooldown((prev) => {
					if (prev <= 1) {
						if (interval) clearInterval(interval);
						return 0;
					}
					return prev - 1;
				});
			}, 1000);
		}

		return () => {
			if (interval) clearInterval(interval);
		};
	}, [resetCooldown]);

	// Helper function to format cooldown time
	const formatCooldownTime = (seconds: number): string => {
		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);
		const remainingSeconds = seconds % 60;

		if (hours > 0) {
			return `${hours}h ${minutes}m ${remainingSeconds}s`;
		} else if (minutes > 0) {
			return `${minutes}m ${remainingSeconds}s`;
		} else {
			return `${remainingSeconds}s`;
		}
	};
	// Common classes
	const sectionHeaderClasses =
		'text-md font-medium text-gray-900 dark:text-white mb-4';
	const sectionDescriptionClasses = 'text-gray-600 dark:text-gray-400 mb-4';
	const sectionDividerClasses =
		'border-t border-gray-200 dark:border-gray-700 pt-6';

	// Button classes
	const greenButtonClasses =
		'bg-white dark:bg-gray-900 border border-green-500 text-green-600 dark:text-green-500 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-colors duration-200 shadow-sm hover:shadow-md';
	// const redButtonClasses = "border border-red-500 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors duration-200";
	const iconClasses = 'mr-2 h-4 w-4';


	const handleSendResetPasswordEmail = async () => {
		if (!user || !user.email) {
			toast.error('Email is required to send reset password email.');
			return;
		}

		// Check rate limiting
		const now = Date.now();
		if (lastResetEmailTime && (now - lastResetEmailTime) < RESET_EMAIL_COOLDOWN_MS) {
			const remainingTime = Math.ceil((RESET_EMAIL_COOLDOWN_MS - (now - lastResetEmailTime)) / 1000);
			toast.error(`Please wait ${formatCooldownTime(remainingTime)} before requesting another reset email.`);
			return;
		}

		try {
			const { success, message } = await sendResetPasswordEmail(user.email);

			if (success) {
				// Update the last reset time and store in localStorage
				const resetTime = Date.now();
				setLastResetEmailTime(resetTime);

				const storageKey = `resetEmail_${user.email}`;
				localStorage.setItem(storageKey, resetTime.toString());

				// Start cooldown timer
				setResetCooldown(Math.ceil(RESET_EMAIL_COOLDOWN_MS / 1000));

				toast.success('Reset password email sent successfully.');
			} else {
				toast.error('Failed to send reset password email: ' + message);
			}
		} catch (error) {
			toast.error('An error occurred while sending the reset email.');
			console.error('Reset email error:', error);
		}
	};

	return (
		<div className='bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 mb-6 rounded-xl shadow-sm hover:shadow-md transition-shadow'>
			<h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
				<FaShieldAlt className='mr-3 h-5 w-5 text-green-600 dark:text-green-500' />
				Security Settings
			</h2>

			<div className='space-y-8'>
				<>
					<h3 className={sectionHeaderClasses}>Change Password</h3>
					{canResetPassword ? (
						<div>
							<p className={sectionDescriptionClasses}>
								Request a password reset email to update your account password. {resetCooldown > 0 && (
									<span className="text-orange-600 dark:text-orange-400 font-medium">
										You can request another reset email in {formatCooldownTime(resetCooldown)}.
									</span>
								)}
							</p>
							<div className='flex justify-start'>
								<Button
									variant='outline'
									className={`${greenButtonClasses} ${resetCooldown > 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
									onClick={handleSendResetPasswordEmail}
									disabled={resetCooldown > 0}
								>
									<FaKey className={iconClasses} />
									{resetCooldown > 0 ? `Wait ${formatCooldownTime(resetCooldown)}` : 'Change Password'}
								</Button>
							</div>
						</div>
					) : (
						<p className={sectionDescriptionClasses}>
							Password reset is not available for your account type: <strong>{capitalizeFirstLetter(user?.provider)}</strong>.
						</p>
					)}
				</>

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
