'use client';
import { getListings } from '@/lib/backend/listings/getListings';
import { FetchedListing } from '@/lib/types/main';
import Link from 'next/link';
import { useState } from 'react';
import { BiUser } from 'react-icons/bi';
import { FaLeaf, FaHandshake, FaRecycle } from 'react-icons/fa';
import { FiSearch, FiArrowRight } from 'react-icons/fi';
import { Categories, categories } from '@/lib/functions/categories';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
} from '@/components/ui/select';
import { useRouter } from 'next/navigation';
import { NextPage } from 'next';
import { Button } from '@/components/ui/button';
import { encodeQueryParam } from '@/lib/functions/url';
import {
	useQuery,
} from '@tanstack/react-query';
import ListingCard from '@/components/ui/ListingCard';

const Home: NextPage = () => {
	const [selectedCategory, setSelectedCategory] =
		useState<Categories['name']>('All Categories');
	const [searchQuery, setSearchQuery] = useState<string>('');
	const router = useRouter();

	// Use React Query directly without useEffect
	const {
		data: featuredListings = [],
		isLoading
	} = useQuery<FetchedListing[]>({
		queryKey: ['listings', 'featured'],
		queryFn: () => getListings('', 4) as Promise<FetchedListing[]>,
		staleTime: 1000 * 60 * 5, // 5 mins
	});

	const handleNavigate = () => {
		if (searchQuery) {
			router.push(
				`/browse?search=${searchQuery}&category=${encodeQueryParam(selectedCategory)}`
			);
		} else {
			router.push(`/browse?category=${encodeQueryParam(selectedCategory)}`);
		}
	};

	return (
		<main>
			{/* Hero Section */}
			<section className='relative bg-gradient-to-r from-green-600 dark:from-green-700 to-green-500 dark:to-green-600 text-white'>
				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40'>
					<div className='lg:grid lg:grid-cols-12 lg:gap-8 items-center'>
						<div className='lg:col-span-7'>
							<h1 className='text-4xl md:text-5xl lg:text-6xl font-bold mb-6'>
								Trade Sustainably Across Europe
							</h1>
							<p className='text-xl md:text-2xl mb-8 text-green-50 max-w-3xl'>
								Join our community of eco-conscious traders giving items a
								second life. Buy, sell, and swap locally to reduce waste and
								create a greener Europe.
							</p>
							<div className='flex flex-col sm:flex-row gap-4'>
								{' '}
								<Link
									href='/register'
									className='px-8 py-3 bg-white text-green-700 font-semibold rounded-full hover:bg-green-50 transition-colors text-center shadow-sm hover:shadow-md'
								>
									Join Now
								</Link>
								<Link
									href='/about'
									className='px-8 py-3 bg-green-700 text-white font-semibold rounded-full border border-green-500 hover:bg-green-600 transition-colors text-center shadow-sm hover:shadow-md'
								>
									Learn More
								</Link>
							</div>
						</div>
					</div>

					{/* Search bar */}
					<div className='mt-12 max-w-3xl mx-auto lg:max-w-none lg:mx-0'>
						<div className='bg-white dark:bg-gray-900 p-2 rounded-lg md:rounded-full shadow-md hover:shadow-lg transition-shadow border border-gray-200 dark:border-gray-800 flex flex-col md:flex-row'>
							<div className='flex-grow border-b dark:border-gray-700 md:border-b-0 md:border-r md:rounded-l-full'>
								<input
									type='text'
									placeholder='What are you looking for?'
									className='w-full pl-5 pr-3 py-3 text-gray-700 dark:text-gray-200 bg-transparent focus:outline-none'
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
								/>
							</div>{' '}
							<div className='flex justify-between items-center mt-1 md:mt-0 md:border-l md:border-gray-200 md:dark:border-gray-700 md:pl-4 py-1'>
								<div className='flex-grow md:flex-grow-0'>
									<Select
										onValueChange={(value: Categories['name']) =>
											setSelectedCategory(value)
										}
										value={selectedCategory}
									>
										<SelectTrigger className='py-2 px-2 bg-transparent text-gray-700 dark:text-gray-200 focus:outline-none border-none! outline-none! w-full'>
											<span className='text-sm truncate max-w-[120px] md:max-w-none'>
												{selectedCategory}
											</span>
										</SelectTrigger>
										<SelectContent className='bg-white dark:bg-gray-900 rounded-lg shadow-sm border-gray-200 dark:border-gray-800 mt-3'>
											{categories.map((category, index) => (
												<SelectItem key={index} value={category.name} className='text-black dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-800'>
													{category.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<Button
									className='bg-green-600 hover:bg-green-700 text-white p-2 cursor-pointer rounded-full flex items-center justify-center transition-colors ml-2 shadow-sm hover:shadow-md'
									onClick={handleNavigate}
								>
									<FiSearch className='h-5 w-5' />
								</Button>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Featured Categories */}
			<section className='py-16 bg-white dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center'>
							<FiSearch className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
							Explore Categories
						</h2>
						<p className='mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
							Find sustainable items across all your needs
						</p>
					</div>

					<div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6'>
						{categories.map((category) => (
							<Link
								key={category.name}
								href={`/browse?category=${encodeQueryParam(category.name)}`}
								className='bg-white dark:bg-gray-900 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow flex flex-col items-center text-center group border border-gray-200 dark:border-gray-800'
							>
								<div className='w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-4'>
									<category.icon className='h-8 w-8 text-green-600 dark:text-green-400' />
								</div>
								<h3 className='font-medium text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors'>
									{category.name}
								</h3>
							</Link>
						))}
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className='py-16 bg-gray-50 dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white'>
							How GreenVue Works
						</h2>
						<p className='mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
							Simple steps to start trading sustainably
						</p>
					</div>

					<div className='grid md:grid-cols-3 gap-8'>
						{/* Step 1 */}
						<div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<div className='w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6'>
								<span className='text-2xl font-bold text-green-600 dark:text-green-400'>
									1
								</span>
							</div>
							<h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
								Create an Account
							</h3>
							<p className='text-gray-600 dark:text-gray-300 mb-4'>
								Sign up for free and build your eco-conscious trader profile.
							</p>
							<Link
								href='/register'
								className='text-green-600 dark:text-green-400 font-medium inline-flex items-center hover:text-green-700 dark:hover:text-green-300 transition-colors'
							>
								Get Started <FiArrowRight className='ml-2' />
							</Link>
						</div>

						{/* Step 2 */}
						<div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<div className='w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6'>
								<span className='text-2xl font-bold text-green-600 dark:text-green-400'>
									2
								</span>
							</div>
							<h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
								Browse or Post Items
							</h3>
							<p className='text-gray-600 dark:text-gray-300 mb-4'>
								Find sustainable goods or list your own items to give them a
								second life.
							</p>
							<Link
								href='/browse'
								className='text-green-600 dark:text-green-400 font-medium inline-flex items-center hover:text-green-700 dark:hover:text-green-300 transition-colors'
							>
								Browse Listings <FiArrowRight className='ml-2' />
							</Link>
						</div>

						{/* Step 3 */}
						<div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<div className='w-14 h-14 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mb-6'>
								<span className='text-2xl font-bold text-green-600 dark:text-green-400'>
									3
								</span>
							</div>
							<h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
								Connect and Trade
							</h3>
							<p className='text-gray-600 dark:text-gray-300 mb-4'>
								Message securely, arrange meetups, and complete your sustainable
								trade.
							</p>
							<Link
								href='/about'
								className='text-green-600 dark:text-green-400 font-medium inline-flex items-center hover:text-green-700 dark:hover:text-green-300 transition-colors'
							>
								Learn More <FiArrowRight className='ml-2' />
							</Link>
						</div>
					</div>
				</div>
			</section>

			{/* Featured listings */}
			{!isLoading && featuredListings.length > 0 ? (
				<section className='py-16 bg-white dark:bg-gray-900'>
					<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
						<div className='flex justify-between items-center mb-12'>
							<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center'>
								<FaLeaf className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
								Featured Listings
							</h2>
							<Link
								href='/browse'
								className='text-green-600 dark:text-green-400 font-medium hover:text-green-700 dark:hover:text-green-300 inline-flex items-center'
							>
								View All <FiArrowRight className='ml-2' />
							</Link>
						</div>

						<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
							{featuredListings.slice(0, 4).map((listing) => (
								<ListingCard
									key={listing.id}
									listing={listing}
									viewMode='grid'
									className='shadow-sm hover:shadow-md transition-shadow'
								/>
							))}
						</div>
					</div>
				</section>
			) : null}

			{/* Impact section */}
			<section className='py-16 bg-gradient-to-br from-green-600 to-green-800 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-12'>
						<h2 className='text-3xl md:text-4xl font-bold mb-4 flex items-center justify-center'>
							<FaRecycle className='mr-3 h-6 w-6 text-green-200' />
							Our Environmental Impact
						</h2>
						<p className='text-xl text-green-50 max-w-3xl mx-auto'>
							Together, our community is making a difference
						</p>
					</div>{' '}
					<div className='grid md:grid-cols-3 gap-8'>
						<div className='bg-green-200/20 bg-opacity-10 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow'>
							<div className='inline-block p-4 bg-white text-green-500 bg-opacity-20 rounded-full mb-4'>
								<FaRecycle className='h-10 w-10' />
							</div>
							<p className='text-4xl font-bold mb-2'>120K+</p>
							<p className='text-xl'>Items Reused</p>
						</div>

						<div className='bg-green-200/20 bg-opacity-10 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow'>
							<div className='inline-block p-4 bg-white text-green-500 bg-opacity-20 rounded-full mb-4'>
								<FaLeaf className='h-10 w-10' />
							</div>
							<p className='text-4xl font-bold mb-2'>2.4K</p>
							<p className='text-xl'>Tons of CO₂ Saved</p>
						</div>

						<div className='bg-green-200/20 bg-opacity-10 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow'>
							<div className='inline-block p-4 bg-white text-green-500 bg-opacity-20 rounded-full mb-4'>
								<FaHandshake className='h-10 w-10' />
							</div>
							<p className='text-4xl font-bold mb-2'>50K+</p>
							<p className='text-xl'>Active Members</p>
						</div>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className='py-16 bg-white dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center'>
							<BiUser className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
							What Our Community Says
						</h2>
						<p className='mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
							Real experiences from sustainable traders
						</p>
					</div>{' '}
					<div className='grid md:grid-cols-3 gap-8'>
						{/* Testimonial 1 */}
						<div className='bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800 relative'>
							<div className='relative z-10'>
								<p className='text-gray-700 dark:text-gray-300 mb-6'>
									I&apos;ve sold and bought several items on GreenVue. The
									community here truly cares about sustainability, and I&apos;ve
									met wonderful people while reducing waste!
								</p>
								<div className='flex items-center'>
									<div className='h-14 w-14 rounded-full overflow-hidden mr-4 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'>
										<BiUser className='h-6 w-6' />
									</div>
									<div>
										<h4 className='font-medium text-gray-900 dark:text-white'>
											Elise Dupont
										</h4>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Brussels, Belgium
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Testimonial 2 */}
						<div className='bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800 relative'>
							<div className='relative z-10'>
								<p className='text-gray-700 dark:text-gray-300 mb-6'>
									As someone who repairs electronics, I find the platform
									perfect for sourcing parts and rehoming my refurbished
									devices. The map feature makes local trades so easy!
								</p>
								<div className='flex items-center'>
									<div className='h-14 w-14 rounded-full overflow-hidden mr-4 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'>
										<BiUser className='h-6 w-6' />
									</div>
									<div>
										<h4 className='font-medium text-gray-900 dark:text-white'>
											Marco Bianchi
										</h4>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Milan, Italy
										</p>
									</div>
								</div>
							</div>
						</div>

						{/* Testimonial 3 */}
						<div className='bg-gray-50 dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800 relative'>
							<div className='relative z-10'>
								<p className='text-gray-700 dark:text-gray-300 mb-6'>
									I&apos;ve furnished my entire apartment with second-hand finds
									from GreenVue. Not only did I save money, but I found unique
									pieces with character and reduced my carbon footprint!
								</p>
								<div className='flex items-center'>
									<div className='h-14 w-14 rounded-full overflow-hidden mr-4 flex items-center justify-center bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400'>
										<BiUser className='h-6 w-6' />
									</div>
									<div>
										<h4 className='font-medium text-gray-900 dark:text-white'>
											Sophia Lindgren
										</h4>
										<p className='text-sm text-gray-500 dark:text-gray-400'>
											Stockholm, Sweden
										</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* CTA Section */}
			<section className='py-20 bg-gray-50 dark:bg-gray-900'>
				<div className='max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-center'>
						<FaHandshake className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
						Ready to Start Your Sustainable Trading Journey?
					</h2>
					<p className='text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto'>
						Join our community today and be part of the circular economy
						movement across Europe.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link
							href='/register'
							className='px-8 py-4 bg-green-600 text-white font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-green-700 transition-all'
						>
							Sign Up Now
						</Link>
						<Link
							href='/browse'
							className='px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-gray-100 transition-all dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
						>
							Browse Listings
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
};

export default Home;
