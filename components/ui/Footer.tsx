import React from "react";
import Link from "next/link";
import { FaLeaf, FaHeart } from "react-icons/fa";
import { FiMail } from "react-icons/fi";
import { categories } from "@/lib/functions/categories";

const Footer: React.FC = () => {
	return (
		<footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 min-h-[400px]">
			{/* Newsletter section */}
			<div className="bg-green-50 dark:bg-gray-800 min-h-[150px]">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
					<div className="lg:flex lg:items-center lg:justify-between">
						<div className="lg:w-0 lg:flex-1">
							<h3 className="text-2xl font-bold text-gray-900 dark:text-white">
								Join our sustainable community
							</h3>
							<p className="mt-3 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
								Get tips for sustainable living and be the first to hear about
								new eco-friendly items in your area.
							</p>
						</div>
						<div className="mt-8 lg:mt-0 lg:ml-8">
							<form className="sm:flex">
								<label htmlFor="email-address" className="sr-only">
									Email address
								</label>
								<input
									id="email-address"
									name="email"
									type="email"
									autoComplete="email"
									required
									className="w-full px-5 py-3 border border-gray-300 dark:border-gray-600 shadow-sm placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:max-w-xs rounded-md dark:bg-gray-700 dark:text-white"
									placeholder="Enter your email"
								/>
								<div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3 sm:flex-shrink-0">
									<button
										type="submit"
										className="cursor-pointer w-full flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
									>
										<FiMail className="mr-2" /> Subscribe
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>

			{/* Main footer */}
			<div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:py-16 lg:px-8 min-h-[250px]">
				<div className="xl:grid xl:grid-cols-4 xl:gap-8">
					{/* Logo and about */}
					<div className="space-y-8 xl:col-span-1">
						<Link href="/" className="flex items-center">
							<FaLeaf className="h-8 w-8 text-green-500" />
							<span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
								GreenVue<span className="text-green-500">.eu</span>
							</span>
						</Link>
						<p className="text-gray-600 dark:text-gray-300 text-base">
							Making sustainable trading accessible across Europe since 2025.
							Creating a greener future, one trade at a time.
						</p>
					</div>

					{/* Links sections */}
					<div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3 mx-auto">
						<div className="md:grid md:grid-cols-2 md:gap-8 w-full">
							<div className="text-center md:text-left">
								<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Marketplace
								</h3>
								<ul className="mt-4 space-y-4">
									<li>
										<Link
											href="/browse"
											className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
										>
											Browse Items
										</Link>
									</li>
									<li>
										<Link
											href="/post"
											className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
										>
											Post an Ad
										</Link>
									</li>
									<li>
										<Link
											href="/login"
											className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
										>
											Log In
										</Link>
									</li>
									<li>
										<Link
											href="/register"
											className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
										>
											Sign Up
										</Link>
									</li>
									<li>
										<Link
											href="/favorites"
											className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
										>
											Favorites
										</Link>
									</li>
								</ul>
							</div>
							<div className="mt-12 md:mt-0 text-center md:text-left">
								<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
									Categories
								</h3>
								<ul className="mt-4 space-y-4 flex flex-col">
									{categories.slice(1, 6).map((category) => (
										<Link
											key={category.id}
											href={`/browse?category=${category.id}`}
											className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
										>
											{category.name}
										</Link>
									))}
								</ul>
							</div>
						</div>
						<div className="text-center md:text-left">
							<h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
								We
							</h3>
							<ul className="mt-4 space-y-4">
								<li>
									<Link
										href="/about"
										className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
									>
										About Us
									</Link>
								</li>
								<li>
									<Link
										href="https://github.com/MonkyMars/GreenVue-Web"
										className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400"
									>
										Source Code
									</Link>
								</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Copyright */}
				<div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
					<div className="flex space-x-6 md:order-2">
						<p className="text-base text-gray-500 dark:text-gray-400">
							Made with <FaHeart className="inline h-4 w-4 text-green-500" />{" "}
							for a greener Europe
						</p>
					</div>
					<p className="mt-8 text-base text-gray-500 dark:text-gray-400 md:mt-0 md:order-1">
						&copy; {new Date().getFullYear()} GreenVue.eu. All rights
						reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
