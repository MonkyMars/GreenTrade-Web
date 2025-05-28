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
			</div>

			{/* Mobile menu */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, height: 0 }}
						animate={{ opacity: 1, height: 'auto' }}
						exit={{ opacity: 0, height: 0 }}
						className='md:hidden bg-white dark:bg-gray-900 shadow-lg z-99'
					>
						<div className='px-4 pt-2 pb-4 space-y-1'>
							<div className='py-2'>
								<p className='px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'>
									Categories
								</p>
								{categories.map((category) => (
									<Link
										key={category.name}
										href={`/browse?category=${category.name}`}
										className='block px-3 py-2 text-gray-700 dark:text-gray-200 hover:bg-green-50 dark:hover:bg-gray-800 rounded-md'
										onClick={() => setIsOpen(false)}
									>
										{category.name}
									</Link>
								))}
							</div>

							<div className='border-t border-gray-200 dark:border-gray-700 pt-4 pb-2'>
								<div className='flex items-center justify-around'>
									<Link
										href='/favorites'
										className='flex flex-col items-center px-3 py-2 text-gray-700 dark:text-gray-200'
										onClick={() => setIsOpen(false)}
									>
										<FiHeart className='w-5 h-5' />
										<span className='text-xs mt-1'>Favorites</span>
									</Link>

									<Link
										href='/messages'
										className='flex flex-col items-center px-3 py-2 text-gray-700 dark:text-gray-200'
										onClick={() => setIsOpen(false)}
									>
										<FiMessageSquare className='w-5 h-5' />
										<span className='text-xs mt-1'>Messages</span>
									</Link>

									<Link
										href='/account'
										className='flex flex-col items-center px-3 py-2 text-gray-700 dark:text-gray-200'
										onClick={() => setIsOpen(false)}
									>
										<FiUser className='w-5 h-5' />
										<span className='text-xs mt-1'>Account</span>
									</Link>
								</div>
							</div>

							<div className='pt-2'>
								<HandlePostButtonMobile />
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</header>
	);
};

export default Navigation;
