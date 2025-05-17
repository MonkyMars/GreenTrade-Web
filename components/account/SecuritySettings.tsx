"use client";

import { FaShieldAlt, FaKey } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const SecuritySettings = () => {
	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
			className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 mb-6"
		>
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
				<FaShieldAlt className="mr-3 h-5 w-5 text-green-600 dark:text-green-500" />
				Security Settings
			</h2>

			<div className="space-y-8">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.1, duration: 0.3 }}
				>
					<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
						Change Password
					</h3>
					<div className="space-y-4">
						<div className="group">
							<label
								htmlFor="currentPassword"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
							>
								Current Password
							</label>
							<input
								type="password"
								id="currentPassword"
								name="currentPassword"
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600"
							/>
						</div>

						<div className="group">
							<label
								htmlFor="newPassword"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
							>
								New Password
							</label>
							<input
								type="password"
								id="newPassword"
								name="newPassword"
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600"
							/>
						</div>

						<div className="group">
							<label
								htmlFor="confirmPassword"
								className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
							>
								Confirm New Password
							</label>
							<input
								type="password"
								id="confirmPassword"
								name="confirmPassword"
								className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600"
							/>
						</div>
					</div>

					<div className="flex justify-end mt-5">
						<Button
							variant="outline"
							className="bg-white dark:bg-gray-900 border border-green-500 text-green-600 dark:text-green-500 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-colors duration-200"
						>
							<FaKey className="mr-2 h-4 w-4" />
							Change Password
						</Button>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.3 }}
					className="border-t border-gray-200 dark:border-gray-700 pt-6"
				>
					<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
						Login Sessions
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						Manage your active login sessions. If you notice any
						suspicious activity, log out of all devices immediately.
					</p>

					<div className="space-y-4">
						<div className="p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-800/50">
							<div className="flex justify-between items-center">
								<div>
									<p className="font-medium text-gray-900 dark:text-white">
										Current Session
									</p>
									<p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
										Windows • Chrome • United Kingdom
									</p>
								</div>
								<span className="px-2 py-1 text-xs text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/30 rounded-full border border-green-200 dark:border-green-800">
									Active
								</span>
							</div>
						</div>
					</div>

					<div className="mt-5">
						<Button
							variant="outline"
							className="border border-red-500 text-red-600 dark:text-red-500 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 dark:hover:text-white transition-colors duration-200"
						>
							Log Out All Devices
						</Button>
					</div>
				</motion.div>

				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.3 }}
					className="border-t border-gray-200 dark:border-gray-700 pt-6"
				>
					<h3 className="text-md font-medium text-gray-900 dark:text-white mb-4">
						Two-Factor Authentication
					</h3>
					<p className="text-gray-600 dark:text-gray-400 mb-4">
						Add an extra layer of security to your account by requiring more than just a password to sign in.
					</p>

					<div className="flex justify-start">
						<Button
							variant="outline"
							className="border border-green-500 text-green-600 dark:text-green-500 hover:bg-green-600 hover:text-white dark:hover:bg-green-600 dark:hover:text-white transition-colors duration-200"
						>
							Set Up 2FA
						</Button>
					</div>
				</motion.div>
			</div>
		</motion.div>
	);
};

export default SecuritySettings;
