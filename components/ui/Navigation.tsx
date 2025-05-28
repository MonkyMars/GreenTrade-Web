'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
	FiUser,
	FiMenu,
	FiX,
	FiHeart,
	FiMessageSquare,
	FiPlus,
	FiSearch,
} from 'react-icons/fi';
import { FaLeaf } from 'react-icons/fa';
import { categories } from '@/lib/functions/categories';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/lib/contexts/AuthContext';
import { encodeQueryParam } from '@/lib/functions/url';
import Image from 'next/image';

interface NavigationProps {
	transparent?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ transparent = false }) => {
	const [isOpen, setIsOpen] = useState(false);
	const { isAuthenticated, user } = useAuth();
	const [scrolled, setScrolled] = useState(false);
	// Handle scroll events for transparent header
	useEffect(() => {
		const handleScroll = () => {
			if (window.scrollY > 20) {
				setScrolled(true);
			} else {
				setScrolled(false);
			}
		};

		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	// Lock body scroll when mobile menu is open
	useEffect(() => {
		if (isOpen) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = 'unset';
		}

		// Cleanup function to restore scroll when component unmounts
		return () => {
			document.body.style.overflow = 'unset';
		};
	}, [isOpen]);

	const HandlePostButtonDesktop = () => {
		if (isAuthenticated) {
			// If user is authenticated, redirect to post page
			return (
				<Link
					href='/post'
					className='flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors'
				>
					<FiPlus className='mr-1 w-4 h-4' />
					<span>Post Ad</span>
				</Link>
			);
		} else {
			// If user is not authenticated, redirect to login page with redirect query
			return (
				<Link
					href='/login?redirect=/account'
					className='flex items-center px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-full transition-colors'
				>
					<FiUser className='mr-1 w-4 h-4' />
					<span>Log in</span>
				</Link>
			);
		}
	};

	const HandlePostButtonMobile = () => {
		if (isAuthenticated) {
			// If user is authenticated, redirect to post page
			return (
				<Link
					href='/post'
					className='block text-center w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors'
				>
					Post New Ad
				</Link>
			);
		} else {
			// If user is not authenticated, redirect to login page with redirect query
			return (
				<Link
					href='/login?redirect=/account'
					className='block text-center w-full px-4 py-3 bg-green-500 hover:bg-green-600 text-white rounded-md transition-colors'
				>
					Log in
				</Link>
			);
		}
	};

	const HandleAccountButton = () => {
		// If user is authenticated, show account button.
		// Else return null to prevent double user icon.
		if (isAuthenticated) {
			return (
				<Link
					href='/account'
					className='text-gray-700 dark:text-gray-200 hover:text-green-500'
				>
					{user?.picture ? (
						<Image
							src={user.picture}
							alt={user.name}
							className='rounded-full w-8 h-8 object-cover hover:opacity-80 transition-opacity duration-200'
							width={28}
							height={28}
							draggable={false}
							priority
						/>
					) : (
						<FiUser className='w-5 h-5' />
					)}
				</Link>
			);
		} else {
			return null;
		}
	};

	return (
		<header
			className={`fixed w-full z-99 transition-all duration-300 ${scrolled || !transparent
				? 'bg-white dark:bg-gray-900 shadow-md'
				: 'bg-transparent'
				}`}
		>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between items-center h-16'>
					{/* Logo */}
					<div className='flex items-center group'>
						<Link href='/' className='flex items-center'>
							<FaLeaf className='h-8 w-8 text-green-500 dark:group-hover:text-white group-hover:text-gray-900 transition-colors duration-200' />
							<span className='ml-2 text-xl font-bold text-gray-900 dark:text-white group-hover:text-green-500 transition-colors duration-200'>
								GreenVue
								<span className='text-green-500 dark:group-hover:text-white group-hover:text-gray-900 transition-colors duration-200'>
									.eu
								</span>
							</span>
						</Link>
					</div>

					{/* Desktop Navigation */}
					<nav className='hidden md:flex items-center space-x-8 h-16'>
						<div className='relative group'>
							<button className='flex items-center text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400'>
								Categories
								<svg
									className='ml-1 w-4 h-4'
									fill='none'
									stroke='currentColor'
									viewBox='0 0 24 24'
									xmlns='http://www.w3.org/2000/svg'
								>
									<path
										strokeLinecap='round'
										strokeLinejoin='round'
										strokeWidth='2'
										d='M19 9l-7 7-7-7'
									></path>
								</svg>
							</button>

							{/* Dropdown menu */}
							<div className='absolute left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-10'>
								{categories.map((category) => (
									<Link
										href={`/browse?category=${encodeQueryParam(category.name)}`}
										key={category.name}
										className='block px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 hover:text-green-500'
									>
										{category.name}
									</Link>
								))}
							</div>
						</div>

						<Link
							href='/browse'
							className='text-gray-700 dark:text-gray-200 hover:text-green-500 dark:hover:text-green-400'
						>
							Browse
						</Link>

						{/* User actions */}
						<div className='flex items-center space-x-4'>
							<Link
								href='/favorites'
								className='text-gray-700 dark:text-gray-200 hover:text-green-500'
							>
								<FiHeart className='w-5 h-5' />
							</Link>

							<Link
								href='/messages'
								className='text-gray-700 dark:text-gray-200 hover:text-green-500'
							>
								<FiMessageSquare className='w-5 h-5' />
							</Link>

							<HandleAccountButton />

							<HandlePostButtonDesktop />
						</div>
					</nav>

					{/* Mobile menu button */}
					<div className='md:hidden'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='text-gray-700 dark:text-gray-200 hover:text-green-500'
							aria-label='Toggle menu'
						>
							{isOpen ? (
								<FiX className='h-6 w-6' />
							) : (
								<FiMenu className='h-6 w-6' />
							)}
						</button>
					</div>
				</div>
			</div>			{/* Mobile menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className='md:hidden bg-white dark:bg-gray-900 shadow-lg z-99'
					>
						<div className='px-4 py-6 space-y-6'>
							{/* Primary Navigation - Browse Section */}
							<div className='bg-green-50 dark:bg-green-900/20 rounded-xl p-4 border border-green-200 dark:border-green-800/50'>
								<Link
									href='/browse'
									className='flex items-center justify-between group'
									onClick={() => setIsOpen(false)}
								>
									<div className='flex items-center space-x-3'>
										<div className='w-10 h-10 rounded-full bg-green-600 flex items-center justify-center'>
											<FiSearch className='w-5 h-5 text-white' />
										</div>
										<div>
											<h3 className='text-lg font-semibold text-gray-900 dark:text-gray-100'>
												Browse Listings
											</h3>
											<p className='text-sm text-gray-600 dark:text-gray-400'>
												Discover eco-friendly items
											</p>
										</div>
									</div>
									<svg
										className='w-5 h-5 text-green-600 dark:text-green-400 group-hover:translate-x-1 transition-transform'
										fill='none'
										viewBox='0 0 24 24'
										stroke='currentColor'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth={2}
											d='M9 5l7 7-7 7'
										/>
									</svg>
								</Link>
							</div>

							{/* Categories Section */}
							<div className='bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700'>
								<h4 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center'>
									<FaLeaf className='w-4 h-4 text-green-600 dark:text-green-500 mr-2' />
									Categories
								</h4>
								<div className='grid grid-cols-2 gap-2'>
									{categories.slice(0, 6).map((category) => (
										<Link
											key={category.name}
											href={`/browse?category=${encodeQueryParam(category.name)}`}
											className='flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition-colors'
											onClick={() => setIsOpen(false)}
										>
											<category.icon className='w-4 h-4 text-green-600 dark:text-green-500' />
											<span className='text-sm font-medium truncate'>{category.name}</span>
										</Link>
									))}
								</div>
								{categories.length > 6 && (
									<Link
										href='/browse'
										className='block text-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700 text-sm text-green-600 dark:text-green-400 font-medium'
										onClick={() => setIsOpen(false)}
									>
										View All Categories
									</Link>
								)}
							</div>

							{/* User Actions Section */}
							{isAuthenticated && (
								<div className='bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700'>
									<h4 className='text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3'>
										Your Account
									</h4>
									<div className='space-y-2'>
										<Link
											href='/account'
											className='flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors'
											onClick={() => setIsOpen(false)}
										>
											{user?.picture ? (
												<Image
													src={user.picture}
													alt={user.name}
													className='rounded-full w-6 h-6 object-cover'
													width={24}
													height={24}
													draggable={false}
												/>
											) : (
												<FiUser className='w-6 h-6' />
											)}
											<span className='text-sm font-medium'>Profile & Settings</span>
										</Link>

										<Link
											href='/favorites'
											className='flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors'
											onClick={() => setIsOpen(false)}
										>
											<FiHeart className='w-6 h-6' />
											<span className='text-sm font-medium'>Favorites</span>
										</Link>

										<Link
											href='/messages'
											className='flex items-center space-x-3 px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors'
											onClick={() => setIsOpen(false)}
										>
											<FiMessageSquare className='w-6 h-6' />
											<span className='text-sm font-medium'>Messages</span>
										</Link>
									</div>
								</div>
							)}

							{/* CTA Section */}
							<div className='space-y-3'>
								<HandlePostButtonMobile />

								{!isAuthenticated && (
									<Link
										href='/account'
										className='flex items-center justify-center space-x-2 w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-lg transition-colors font-medium'
										onClick={() => setIsOpen(false)}
									>
										<FiUser className='w-5 h-5' />
										<span>My Account</span>
									</Link>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Navigation;
