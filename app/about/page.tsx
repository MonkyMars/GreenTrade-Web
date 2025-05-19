import { NextPage } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { FaLeaf, FaHandshake } from 'react-icons/fa';
import { IoEarthOutline } from 'react-icons/io5';

const About: NextPage = () => {
	return (
		<main className='pt-16'>
			{/* Hero section */}
			<section className='relative bg-gradient-to-br from-green-600 to-green-800 text-white py-24 md:py-32'>
				<div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex-wrap'>
					<h1 className='text-4xl md:text-5xl lg:text-6xl flex-col font-bold mb-6 flex items-center justify-center gap-1	'>
						<FaLeaf className='mr-3 h-8 w-8 text-green-300 inline' />
						Transforming How Europe{' '}
						<span className='text-green-300'>Trades Sustainably</span>
					</h1>
					<p className='text-xl md:text-2xl max-w-3xl mx-auto text-green-50'>
						Our mission is to create a circular economy where pre-loved items
						find new homes and sustainable choices become the default.
					</p>
				</div>
			</section>

			{/* Our story */}
			<section className='py-16 md:py-24 bg-white dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='lg:grid lg:grid-cols-2 lg:gap-12 items-center'>
						<div>
							<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6 flex items-center'>
								<FaHandshake className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
								Our Story
							</h2>
							<p className='text-lg text-gray-700 dark:text-gray-300 mb-6'>
								GreenVue.eu was born from a simple observation: across Europe,
								we have too many things that could be reused instead of
								discarded, and too few accessible platforms to connect people
								who want to trade sustainably.
							</p>
							<p className='text-lg text-gray-700 dark:text-gray-300 mb-6'>
								Founded in 2025 by a team of environmentalists and tech
								enthusiasts, we set out to create a marketplace that makes
								sustainable choices simple, transparent, and community-driven.
							</p>
							<p className='text-lg text-gray-700 dark:text-gray-300'>
								Today, we&apos;re proud to connect thousands of Europeans in a
								shared mission to reduce waste, minimize carbon footprints, and
								build a more sustainable future—one trade at a time.
							</p>
						</div>
						<div className='mt-10 lg:mt-0'>
							<div className='relative h-96 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
								<Image
									src='/images/handshake_background.webp'
									alt='GreenVue team collaboration'
									fill
									style={{ objectFit: 'cover' }}
									className='rounded-xl'
								/>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Our values */}
			<section className='py-16 md:py-24 bg-gray-50 dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center'>
							<FaLeaf className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
							Our Values
						</h2>
						<p className='mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
							The principles that guide everything we do
						</p>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
						{/* Value 1 */}
						<div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<div className='inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-6'>
								<FaLeaf className='h-8 w-8 text-green-500' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
								Environmental Impact
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								We believe every transaction is an opportunity to reduce waste
								and carbon emissions. By extending the lifecycle of products,
								we&apos;re building a more sustainable economy.
							</p>
						</div>

						{/* Value 2 */}
						<div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<div className='inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-6'>
								<FaHandshake className='h-8 w-8 text-green-500' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
								Community First
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								We&apos;re not just a marketplace—we&apos;re building
								communities of like-minded individuals who care about
								sustainability, fair trade, and human connection.
							</p>
						</div>

						{/* Value 3 */}
						<div className='bg-white dark:bg-gray-900 p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<div className='inline-block p-4 bg-green-100 dark:bg-green-900 rounded-full mb-6'>
								<IoEarthOutline className='h-8 w-8 text-green-500' />
							</div>
							<h3 className='text-xl font-bold text-gray-900 dark:text-white mb-4'>
								European Unity
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								We celebrate European diversity while creating a unified
								platform that transcends borders, encouraging sustainable trade
								throughout the continent.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* How it works */}
			<section className='py-16 md:py-24 bg-white dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center'>
							<FaHandshake className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
							How GreenVue Works
						</h2>
						<p className='mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
							Sustainable trading made simple
						</p>
					</div>

					<div className='relative'>
						{/* Timeline line */}
						<div className='hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 bg-green-200 h-full'></div>

						{/* Step 1 */}
						<div className='relative md:grid md:grid-cols-2 md:gap-8 mb-12 md:mb-24'>
							<div className='md:text-right md:pr-12 bg-accent p-2 py-4 rounded-lg'>
								<h3 className='text-2xl font-bold text-white mb-4'>
									1. Create your account
								</h3>
								<p className='text-gray-200'>
									Sign up with your email or social media account and set up
									your sustainable trader profile in minutes.
								</p>
							</div>
						</div>

						{/* Step 2 */}
						<div className='relative md:grid md:grid-cols-2 md:gap-8 mb-12 md:mb-24'>
							<div className='md:order-2 md:text-left md:pl-12 bg-accent p-2 py-4 rounded-lg'>
								<h3 className='text-2xl font-bold text-white mb-4'>
									2. List your items
								</h3>
								<p className='text-gray-200'>
									Upload photos and descriptions of your sustainable goods, set
									your price or trade preferences, and highlight their
									eco-friendly qualities.
								</p>
							</div>
							<div className='mt-6 md:mt-0 md:order-1 md:pr-12' />{' '}
							{/* div for positioning */}
						</div>

						{/* Step 3 */}
						<div className='relative md:grid md:grid-cols-2 md:gap-8'>
							<div className='md:text-right md:pr-12 bg-accent p-2 py-4 rounded-lg'>
								<h3 className='text-2xl font-bold text-white mb-4'>
									3. Connect and trade
								</h3>
								<p className='text-gray-200'>
									Message other users, arrange meetups using our integrated map
									feature, and complete your sustainable trades with confidence.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Impact stats */}
			<section className='py-16 md:py-24 bg-green-600 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold flex items-center justify-center'>
							<IoEarthOutline className='mr-3 h-6 w-6 text-green-200' />
							Our Impact So Far
						</h2>
						<p className='mt-4 text-xl text-green-50 max-w-3xl mx-auto'>
							Together, we&apos;re making a measurable difference
						</p>
					</div>

					<div className='grid md:grid-cols-2 lg:grid-cols-4 gap-8'>
						<div className='bg-green-700 bg-opacity-50 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow'>
							<p className='text-4xl md:text-5xl font-bold mb-2'>50K+</p>
							<p className='text-xl text-green-100'>Active Users</p>
						</div>

						<div className='bg-green-700 bg-opacity-50 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow'>
							<p className='text-4xl md:text-5xl font-bold mb-2'>120K+</p>
							<p className='text-xl text-green-100'>Items Traded</p>
						</div>

						<div className='bg-green-700 bg-opacity-50 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow'>
							<p className='text-4xl md:text-5xl font-bold mb-2'>28</p>
							<p className='text-xl text-green-100'>European Countries</p>
						</div>

						<div className='bg-green-700 bg-opacity-50 p-8 rounded-xl text-center shadow-sm hover:shadow-md transition-shadow'>
							<p className='text-4xl md:text-5xl font-bold mb-2'>
								4.8<span className='text-2xl'>/5</span>
							</p>
							<p className='text-xl text-green-100'>User Rating</p>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ section */}
			<section className='py-16 md:py-24 bg-gray-50 dark:bg-gray-900'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
					<div className='text-center mb-16'>
						<h2 className='text-3xl md:text-4xl font-bold text-gray-900 dark:text-white flex items-center justify-center'>
							<FaHandshake className='mr-3 h-6 w-6 text-green-600 dark:text-green-500' />
							Frequently Asked Questions
						</h2>
						<p className='mt-4 text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto'>
							Everything you need to know about GreenVue
						</p>
					</div>

					<div className='max-w-3xl mx-auto space-y-6'>
						{/* FAQ Item 1 */}
						<div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
								Is GreenVue available in all European countries?
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								Yes! GreenVue is available across all EU member states, as well
								as the UK, Norway, and Switzerland. Our platform automatically
								translates listings to make cross-border trading seamless.
							</p>
						</div>

						{/* FAQ Item 2 */}
						<div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
								How do you ensure trades are actually sustainable?
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								We have a community-based verification system where users can
								earn sustainability badges. Our algorithm also highlights items
								with lower carbon footprints and promotes local trades to
								minimize transport emissions.
							</p>
						</div>

						{/* FAQ Item 3 */}
						<div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
								Is there a fee for using GreenVue?
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								No, GreenVue is completely free to use! We believe in making
								sustainable trading accessible to everyone.
							</p>
						</div>

						{/* FAQ Item 4 */}
						<div className='bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 dark:border-gray-800'>
							<h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-3'>
								How do I know if a seller is trustworthy?
							</h3>
							<p className='text-gray-600 dark:text-gray-300'>
								Each user has a trust score based on verified transactions,
								community reviews, and profile completeness. We also offer a
								secure messaging system and recommend meeting in safe, public
								locations for exchanges.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* CTA section */}
			<section className='py-16 md:py-24 bg-green-600 text-white'>
				<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center'>
					<h2 className='text-3xl md:text-4xl font-bold mb-6 flex items-center justify-center'>
						<FaLeaf className='mr-3 h-6 w-6 text-green-200' />
						Ready to Start Trading Sustainably?
					</h2>
					<p className='text-xl text-green-50 max-w-2xl mx-auto mb-8'>
						Join thousands of Europeans who are making a positive impact through
						mindful trading.
					</p>
					<div className='flex flex-col sm:flex-row justify-center gap-4'>
						<Link
							href='/register'
							className='px-8 py-4 bg-white text-green-600 font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-green-50 transition-all'
						>
							Join GreenVue
						</Link>
						<Link
							href='/browse'
							className='px-8 py-4 bg-green-700 text-white font-semibold rounded-full shadow-sm hover:shadow-md hover:bg-green-800 transition-all border border-green-600'
						>
							Browse Listings
						</Link>
					</div>
				</div>
			</section>
		</main>
	);
};

export default About;
