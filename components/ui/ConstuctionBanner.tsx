import React from 'react';
import { FiAlertCircle } from 'react-icons/fi';

export default function ConstructionBanner() {

	if (process.env.NODE_ENV === 'development') {
		return null;
	}

	return (
		<div className='pt-16'>
			<div className='bg-amber-100 text-amber-800 px-4 py-3 flex justify-between items-center w-full z-50 relative'>
				<div className='flex items-center space-x-2'>
					<FiAlertCircle className='flex-shrink-0' />
					<p className='text-sm font-medium'>
						This website is currently under development. All data displayed is for demonstration
						purposes only and is not real. We are not liable for any decisions made based on this information.
					</p>
				</div>
			</div>
		</div>
	);
}