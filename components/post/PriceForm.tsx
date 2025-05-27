import { z } from 'zod';
import { Checkbox } from '@/components/ui/checkbox';
import { UploadListing } from '@/lib/types/main';

interface PriceLocationFormProps {
	formData: UploadListing;
	setFormData: React.Dispatch<React.SetStateAction<UploadListing>>;
	formErrors: z.ZodIssue[];
}

const PriceLocationForm = ({
	formData,
	setFormData,
	formErrors,
}: PriceLocationFormProps) => {
	return (
		<section className='bg-white dark:bg-gray-800 shadow overflow-hidden rounded-lg'>
			<div className='px-4 py-5 sm:px-6 border-b border-gray-200 dark:border-gray-700'>
				<h2 className='text-lg font-medium text-gray-900 dark:text-white'>
					Price & Location
				</h2>
			</div>
			<div className='px-4 py-5 sm:p-6 space-y-6'>
				{/* Price */}
				<div>
					<label
						htmlFor='price'
						className='block text-sm font-medium text-gray-700 dark:text-gray-300'
					>
						Price (€) <span className='text-red-500'>*</span>
					</label>
					<div className='mt-1 relative rounded-md shadow-sm'>
						<div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
							<span className='text-gray-500 dark:text-gray-400 sm:text-sm'>
								€
							</span>
						</div>
						<input
							type='number'
							name='price'
							id='price'
							value={formData.price || ''}
							onChange={(e) => {
								const value = e.target.value;
								// Convert to string, limit to 2 decimal places, then parse back to float
								const formattedValue = value === '' ? 0 : parseFloat(parseFloat(value).toFixed(2));
								setFormData((prev) => ({
									...prev,
									price: formattedValue,
								}));
							}}
							step={0.01}
							min={0}
							max={1000000}
							className={`pl-6 block w-full px-4 py-3 rounded-md shadow-sm text-base transition-all duration-200 ease-in-out focus:ring-0 focus:border-transparent focus:outline-none
						${formErrors.find((error) => error.path[0] === 'price')
									? 'border-2 border-red-300 focus:ring-1 focus:ring-green-400'
									: 'border border-gray-300 dark:border-gray-600 hover:border-green-300'
								}
						dark:bg-gray-700 dark:text-white placeholder-gray-400 dark:placeholder-gray-500`}
							placeholder='0.00'
						/>
					</div>
					{formErrors.find((error) => error.path[0] === 'price') && (
						<p className='mt-1 text-sm text-red-600 dark:text-red-400'>
							{formErrors.find((error) => error.path[0] === 'price')?.message}
						</p>
					)}
				</div>

				{/* Negotiable checkbox */}
				<div>
					{/* <label className='block text-sm font-medium text-gray-700 dark:text-gray-300'>
						Price Options
					</label> */}
					<div className='mt-1 flex items-center rounded-md shadow-md border border-gray-300 dark:border-gray-600 hover:border-green-300 px-4 py-3.5 transition-all duration-200 ease-in-out dark:bg-gray-700'>
						<Checkbox
							id='negotiable'
							name='negotiable'
							checked={formData.negotiable}
							onCheckedChange={(checked) => {
								setFormData((prev) => ({
									...prev,
									negotiable: checked === true,
								}));
							}}
							className='h-5 w-5 text-green-600 focus:ring-green-500 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:focus:ring-green-500 cursor-pointer'
						/>
						<label
							htmlFor='negotiable'
							className='ml-3 block text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none'
						>
							Price is negotiable
						</label>
					</div>
				</div>
			</div>
		</section>
	);
};

export default PriceLocationForm;
