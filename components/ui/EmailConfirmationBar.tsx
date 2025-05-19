'use client';

import { useAuth } from '@/lib/contexts/AuthContext';
import React from 'react';
import { FiAlertCircle, FiX } from 'react-icons/fi';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { resendEmail } from '@/lib/backend/auth/user';

export const EmailConfirmationBar: React.FC = () => {
	const { user } = useAuth();
	const [isVisible, setIsVisible] = useState(false);

	// Check if user is logged in but hasn't confirmed email (lastSignInAt is undefined)
	useEffect(() => {
		setIsVisible(!!user && user.emailVerified == false);
	}, [user]);

	const handleClose = () => {
		setIsVisible(false);
	};

	const handleResendEmail = async (): Promise<void> => {
		if (!user) return;
		try {
			const data = await resendEmail(user.email);
			if (!data) {
				throw new Error('No data returned from resendEmail');
			}
			toast.success('Confirmation email resent successfully!');
		} catch (error) {
			console.error('Error resending email:', error);
			toast.error(
				'Failed to resend confirmation email. Please try again later.'
			);
		} finally {
			handleClose();
		}
	};

	if (!isVisible) return null;

	return (
		<div className='pt-16'>
			<div className='bg-amber-100 text-amber-800 px-4 py-3 flex justify-between items-center w-full z-50 relative'>
				<div className='flex items-center space-x-2'>
					<FiAlertCircle className='flex-shrink-0' />
					<p className='text-sm font-medium'>
						Please confirm your email address to activate your account and
						access all features.
					</p>
				</div>
				<div className='flex items-center space-x-3'>
					<button
						onClick={handleResendEmail}
						className='bg-amber-200 text-amber-800 hover:bg-amber-200/50 focus:outline-none rounded-md px-4 py-2 text-sm cursor-pointer'
					>
						Resend Email
					</button>
					<button
						onClick={handleClose}
						className='text-amber-800 hover:text-amber-900 focus:outline-none cursor-pointer'
						aria-label='Close notification'
					>
						<FiX className='w-5 h-5' />
					</button>
				</div>
			</div>
		</div>
	);
};
