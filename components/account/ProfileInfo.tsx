"use client";

import { FaUser, FaCheck } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { User } from "@/lib/types/user";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchCountriesInEurope } from "@/lib/functions/countries";
import { motion } from "framer-motion";

interface ProfileInfoProps {
	user: User | null;
	handleUpdateUser: (e: React.FormEvent) => Promise<void>;
	updateSuccess: string;
	setUpdateSuccess: (message: string) => void;
	location: { city: string; country: string };
	setLocation: (location: { city: string; country: string }) => void;
	disabled: boolean;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
	user,
	handleUpdateUser,
	updateSuccess,
	setUpdateSuccess,
	location,
	setLocation,
	disabled
}) => {
	const countries = fetchCountriesInEurope();

	return (
		<motion.div
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			transition={{ duration: 0.4 }}
			className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6 mb-6"
		>
			<h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
				<FaUser className="mr-3 h-5 w-5 text-green-600 dark:text-green-500" />
				Profile Information
			</h2>

			{updateSuccess && (
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					className="bg-green-50 dark:bg-green-900/20 border border-green-200 text-green-700 dark:text-green-300 px-4 py-3 rounded-md mb-6"
				>
					<div className="flex items-center">
						<FaCheck className="h-4 w-4 mr-2" />
						<span>{updateSuccess}</span>
						<button
							className="ml-auto text-green-700 dark:text-green-300 hover:text-green-900 flex items-center justify-center dark:hover:text-green-200 text-2xl"
							onClick={() => setUpdateSuccess("")}
						>
							&times;
						</button>
					</div>
				</motion.div>
			)}

			<form className="space-y-6" onSubmit={handleUpdateUser}>
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="group">
						<label
							htmlFor="name"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
						>
							Full Name
						</label>
						<input
							type="text"
							id="name"
							name="name"
							defaultValue={user?.name}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600"
						/>
					</div>

					<div className="group">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
						>
							Email Address
						</label>
						<input
							type="email"
							id="email"
							name="email"
							defaultValue={user?.email}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-900 cursor-not-allowed dark:text-white"
							disabled
						/>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Email cannot be changed
						</p>
					</div>

					<div className="block group">
						<label
							htmlFor="city"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
						>
							City / Town
						</label>
						<input
							type="text"
							id="city"
							name="city"
							value={location.city}
							onChange={(e) =>
								setLocation({ ...location, city: e.target.value })
							}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600"
						/>
					</div>

					<div className="block group">
						<label
							htmlFor="country"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
						>
							Country
						</label>
						<Select
							value={location.country}
							onValueChange={(value) =>
								setLocation({ ...location, country: value })
							}
						>
							<SelectTrigger
								id="country"
								className="w-full px-3 py-2 h-auto border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600"
							>
								<SelectValue placeholder="Select a country" />
							</SelectTrigger>
							<SelectContent className="max-h-80">
								{countries.map((country) => (
									<SelectItem key={country.name} value={country.name}>
										{country.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</div>

				<div className="border-t border-gray-200 dark:border-gray-800 pt-4">
					<div className="group">
						<label
							htmlFor="bio"
							className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors duration-200"
						>
							Bio
						</label>
						<textarea
							id="bio"
							name="bio"
							rows={4}
							defaultValue={user?.bio || ""}
							className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 dark:bg-gray-800 dark:text-white transition-all duration-200 hover:border-green-400 dark:hover:border-green-600"
						/>
						<p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
							Write a short bio to tell others about yourself
						</p>
					</div>
				</div>

				<div className="flex justify-end">
					<Button 
						type="submit"
						disabled={disabled}
						className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 border border-green-600 dark:border-green-700 transition-colors"
					>
						Update Profile
					</Button>
				</div>
			</form>
		</motion.div>
	);
};

export default ProfileInfo;
