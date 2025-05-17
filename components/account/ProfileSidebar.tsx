"use client";

import { User } from "@/lib/types/user";
import { FaUser, FaStore, FaShieldAlt, FaTrash, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { cn } from "@/lib/functions/cn";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProfileSidebarProps {
	user: User | null;
	activeTab: "profile" | "seller" | "security" | "delete";
	setActiveTab: (tab: "profile" | "seller" | "security" | "delete") => void;
	handleLogout: () => void;
	userListingsCount: number;
	averageEcoScore: number;
}

const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
	user,
	activeTab,
	setActiveTab,
	handleLogout,
	userListingsCount,
	averageEcoScore,
}) => {
	const fadeIn = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.4 } },
	};

	const slideUp = {
		hidden: { opacity: 0 },
		visible: { opacity: 1, transition: { duration: 0.4 } },
	};

	return (
		<motion.div
			initial="hidden"
			animate="visible"
			variants={fadeIn}
			className="md:w-72 flex-shrink-0 space-y-6"
		>
			<motion.div
				variants={slideUp}
				className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6"
			>
				<div className="flex flex-col items-center">
					<div className="relative h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden mb-4 border-2 border-green-100 dark:border-green-900">
						<Avatar user={user} />
					</div>

					<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-1">
						{user?.name || "Loading..."}
					</h2>

					<p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
						{user?.email || ""}
					</p>

					{userListingsCount > 0 && (
						<Badge className="mb-4 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-800 transition-colors duration-200 px-3 py-1">
							<FaStore className="mr-2 h-3 w-3" />
							Seller
						</Badge>
					)}

					<div className="w-full mt-3 space-y-2">
						<Button
							variant="outline"
							className={cn(
								"w-full relative justify-start transition-colors",
								activeTab === "profile"
									? "bg-green-500 hover:bg-green-600 border-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-700"
									: "hover:border-green-200 hover:bg-green-50 dark:hover:border-green-800 dark:hover:bg-green-950"
							)}
							onClick={() => setActiveTab("profile")}
						>
							<FaUser className={cn(
								"mr-3 h-4 w-4",
								activeTab === "profile" ? "text-white" : "text-green-600 dark:text-green-500"
							)} />
							Profile
						</Button>

						<Button
							variant="outline"
							className={cn(
								"w-full relative justify-start transition-colors",
								activeTab === "security"
									? "bg-green-500 hover:bg-green-600 border-green-600 text-white dark:bg-green-600 dark:hover:bg-green-700 dark:border-green-700"
									: "hover:border-green-200 hover:bg-green-50 dark:hover:border-green-800 dark:hover:bg-green-950"
							)}
							onClick={() => setActiveTab("security")}
						>
							<FaShieldAlt className={cn(
								"mr-3 h-4 w-4",
								activeTab === "security" ? "text-white" : "text-green-600 dark:text-green-500"
							)} />
							Security
						</Button>

						<Button
							variant="outline"
							className={cn(
								"w-full relative justify-start transition-colors",
								activeTab === "delete"
									? "bg-red-500 hover:bg-red-600 border-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700 dark:border-red-700"
									: "hover:border-red-200 hover:bg-red-50 dark:hover:border-red-800 dark:hover:bg-red-950 text-red-600 dark:text-red-500"
							)}
							onClick={() => setActiveTab("delete")}
						>
							<FaTrash className={cn(
								"mr-3 h-4 w-4",
								activeTab === "delete" ? "text-white" : "text-red-600 dark:text-red-500"
							)} />
							Delete Account
						</Button>

						<Button
							variant="outline"
							className="w-full relative justify-start mt-4 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:bg-red-50 hover:text-red-600 hover:border-red-200 dark:hover:bg-red-950 dark:hover:text-red-400 dark:hover:border-red-900 transition-colors"
							onClick={handleLogout}
						>
							<FaSignOutAlt className="mr-3 h-4 w-4 text-red-500" />
							Log Out
						</Button>
					</div>
				</div>
			</motion.div>

			<motion.div
				variants={slideUp}
				className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-800 p-6"
			>
				<h3 className="text-sm font-medium text-gray-900 dark:text-white mb-4">
					Account Summary
				</h3>

				<div className="space-y-4">
					<div className="flex justify-between text-sm items-center">
						<span className="text-gray-600 dark:text-gray-400">
							Member since
						</span>
						<span className="font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
							{new Date(user?.createdAt || Date.now()).toLocaleDateString()}
						</span>
					</div>

					<div className="flex justify-between text-sm items-center">
						<span className="text-gray-600 dark:text-gray-400">
							Listings
						</span>
						<span className="font-medium text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-2 py-1 rounded">
							{userListingsCount || 0}
						</span>
					</div>

					{userListingsCount > 0 && (
						<div className="flex justify-between text-sm items-center">
							<span className="text-gray-600 dark:text-gray-400">
								Eco Score
							</span>
							<span className="font-medium border border-green-200 dark:border-green-900 bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300 px-2 py-1 rounded">
								{averageEcoScore}/5
							</span>
						</div>
					)}
				</div>
			</motion.div>
		</motion.div>
	);
};

export default ProfileSidebar;
