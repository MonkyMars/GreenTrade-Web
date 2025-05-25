import { NextPage } from "next";
import { FaLeaf } from "react-icons/fa";
import Link from "next/link";

const LoginSkeleton: NextPage = () => {
	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4 py-22 sm:px-6 lg:px-8'>
			<div className='max-w-md w-full space-y-8 p-8 rounded-lg dark:bg-slate-800 shadow-xl'>
				{/* Logo and Header */}
				<div className='text-center'>
					<Link href='/' className='inline-block'>
						<div className='flex items-center justify-center'>
							<FaLeaf className='h-12 w-12 text-green-600' />
							<h1 className='ml-2 text-3xl font-bold text-green-600'>
								GreenVue
							</h1>
						</div>
					</Link>
					<div className='mt-6 h-8 bg-gray-200 dark:bg-gray-700 rounded animate-pulse'></div>
					<div className='mt-2 h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto animate-pulse'></div>
				</div>

				{/* Form placeholder */}
				<div className='mt-8 space-y-6'>
					<div className='rounded-md shadow-sm -space-y-px'>
						{/* Email field skeleton */}
						<div className='mb-4'>
							<div className='relative'>
								<div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full animate-pulse'></div>
							</div>
						</div>

						{/* Password field skeleton */}
						<div className='mb-4'>
							<div className='relative'>
								<div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full animate-pulse'></div>
							</div>
						</div>
					</div>

					{/* Forgot password link placeholder */}
					<div className='flex items-center justify-between'>
						<div className='text-sm'>
							<div className='h-4 bg-gray-200 dark:bg-gray-700 rounded w-36 animate-pulse'></div>
						</div>
					</div>

					{/* Sign in button placeholder */}
					<div>
						<div className='h-10 bg-green-500 dark:bg-green-600 rounded-md w-full animate-pulse'></div>
					</div>

					{/* Divider */}
					<div className='mt-6'>
						<div className='relative'>
							<div className='absolute inset-0 flex items-center'>
								<div className='w-full border-t border-gray-300 dark:border-gray-700'></div>
							</div>
							<div className='relative flex justify-center text-sm'>
								<span className='px-2 bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
									Or continue with
								</span>
							</div>
						</div>

						{/* Social login button placeholder */}
						<div className='mt-6'>
							<div className='h-10 bg-gray-200 dark:bg-gray-700 rounded-md w-full animate-pulse'></div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default LoginSkeleton;