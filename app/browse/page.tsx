"use client";

import { useQuery } from '@tanstack/react-query';
import { Suspense, useEffect, useState } from "react";
import {
	FaFilter,
} from "react-icons/fa";
import { FiSearch, FiGrid, FiList, FiX, FiChevronDown } from "react-icons/fi";
import { FetchedListing } from "../../lib/types/main";
import { getListings } from "@/lib/backend/listings/getListings";
import { Categories, categories } from "@/lib/functions/categories";
import { useRouter, useSearchParams } from "next/navigation";
import ListingCard from "../../components/ui/ListingCard";
import { FilterOptions, filterListings, extractCountry } from "./filtering";
import { NextPage } from "next";
import { Button } from "@/components/ui/button";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const ITEMS_PER_PAGE: number = 50; // Define items per page

const BrowserComponent: NextPage = () => {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
	const [currentPage, setCurrentPage] = useState<number>(1);
	const [allListings, setAllListings] = useState<FetchedListing[]>([]);
	const [filteredListings, setFilteredListings] = useState<FetchedListing[]>([]);
	const [isInitialLoad, setIsInitialLoad] = useState<boolean>(true);

	// Filter state
	const [filters, setFilters] = useState<FilterOptions>({
		category: "All Categories",
		search: "",
		country: "all",
		minPrice: undefined,
		maxPrice: undefined,
		minEcoScore: undefined,
		condition: "all",
		sortBy: "newest"
	});

	const useListings = () => {
		return useQuery<FetchedListing[]>({
			queryKey: ['listings'],
			queryFn: () => getListings() as Promise<FetchedListing[]>,
			staleTime: 1000 * 60 * 5, // 5 mins
		});
	};

	// In your component
	const { data: listingsData, isLoading, isSuccess } = useListings();

	useEffect(() => {
		if (!isLoading && listingsData) {
			setAllListings(listingsData);
		}
	}, [isLoading, listingsData]);

	useEffect(() => {
		if (isSuccess) {
			setIsInitialLoad(false);
		}
	}, [isSuccess]);

	// Process URL search parameters on page load and parameter changes
	useEffect(() => {
		// No need to run if initial load is still happening
		// The filter effect will run once listings are loaded anyway
		if (isInitialLoad) return;

		const category = searchParams.get("category") as Categories["name"] || "All Categories";
		const search = searchParams.get("search") || "";
		const country = searchParams.get("country") || "all";
		const minPrice = searchParams.get("minPrice");
		const maxPrice = searchParams.get("maxPrice");
		const minEcoScore = searchParams.get("minEcoScore");
		const condition = searchParams.get("condition") || "all";
		const sortBy = searchParams.get("sortBy") || "newest";

		// Update filters from URL params
		setFilters({
			category,
			search,
			country,
			minPrice: minPrice ? parseFloat(minPrice) : undefined,
			maxPrice: maxPrice ? parseFloat(maxPrice) : undefined,
			minEcoScore: minEcoScore ? parseFloat(minEcoScore) : undefined,
			condition,
			sortBy
		});
	}, [searchParams, isInitialLoad]); // Rerun if params or initial load state changes

	// Apply filters whenever filters change or when allListings are loaded
	useEffect(() => {
		if (allListings.length > 0) {
			const filtered = filterListings(allListings, filters);
			setFilteredListings(filtered);
		}
	}, [filters, allListings]);

	// Reset to page 1 when filters change (excluding initial load)
	useEffect(() => {
		// Only reset page if it's not the initial load causing the filter change
		if (!isInitialLoad) {
			setCurrentPage(1);
		}
	}, [filters, isInitialLoad]); // Depend on filters and isInitialLoad

	// Update URL with current filter state
	const updateURL = () => {
		const params = new URLSearchParams();

		if (filters.category && filters.category !== "All Categories")
			params.append("category", filters.category);
		if (filters.search && filters.search.trim() !== "")
			params.append("search", filters.search);
		if (filters.country && filters.country !== "all")
			params.append("country", filters.country);
		if (filters.minPrice !== undefined)
			params.append("minPrice", filters.minPrice.toString());
		if (filters.maxPrice !== undefined)
			params.append("maxPrice", filters.maxPrice.toString());
		if (filters.minEcoScore !== undefined)
			params.append("minEcoScore", filters.minEcoScore.toString());
		if (filters.condition && filters.condition !== "all")
			params.append("condition", filters.condition);
		if (filters.sortBy && filters.sortBy !== "newest")
			params.append("sortBy", filters.sortBy);

		router.replace(`/browse?${params.toString()}`, { scroll: false });
	};

	// Extract unique countries from all listings for the country dropdown
	const availableCountries = Array.from(
		new Set(
			allListings
				.map((listing) => extractCountry(listing.location))
				.filter(Boolean) as string[]
		)
	).sort();

	// Update category filter and URL
	const toggleCategory = (categoryName: Categories["name"]) => {
		setFilters(prev => ({
			...prev,
			category: categoryName
		}));
		// URL update will be handled by the applyFilters function or button
	};

	// Handle filter input changes
	const handleFilterChange = (name: keyof FilterOptions, value: string | number | undefined) => {
		setFilters(prev => ({ ...prev, [name]: value }));
		// URL update will be handled by the applyFilters function or button
	};

	// Apply all filters and update URL
	const applyFilters = () => {
		updateURL();
		setIsFilterOpen(false); // Close mobile filter sidebar on apply
	};

	// Calculate pagination variables
	const totalPages = Math.ceil(filteredListings.length / ITEMS_PER_PAGE);
	const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
	const endIndex = startIndex + ITEMS_PER_PAGE;
	const currentListings = filteredListings.slice(startIndex, endIndex);

	// Pagination handlers
	const goToPage = (page: number) => {
		const newPage = Math.max(1, Math.min(page, totalPages || 1)); // Ensure page is within bounds
		setCurrentPage(newPage);
		window.scrollTo(0, 0); // Scroll to top on page change
	};

	const goToPreviousPage = () => {
		goToPage(currentPage - 1);
	};

	const goToNextPage = () => {
		goToPage(currentPage + 1);
	};

	// Function to generate pagination buttons
	const renderPaginationButtons = () => {
		const buttons = [];
		const maxButtonsToShow = 5; // Max number of page buttons to show (excluding prev/next/ellipsis)
		let startPage = Math.max(1, currentPage - Math.floor(maxButtonsToShow / 2));
		let endPage = Math.min(totalPages, startPage + maxButtonsToShow - 1);

		// Adjust startPage if endPage is at the limit and we have enough pages
		if (endPage === totalPages && totalPages >= maxButtonsToShow) {
			startPage = Math.max(1, totalPages - maxButtonsToShow + 1);
		}
		// Adjust endPage if startPage is 1 and we have enough pages
		if (startPage === 1 && totalPages >= maxButtonsToShow) {
			endPage = Math.min(totalPages, maxButtonsToShow);
		}

		// Show '1' and '...' if needed
		if (startPage > 1) {
			buttons.push(
				<button
					key="start"
					onClick={() => goToPage(1)}
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					1
				</button>
			);
			if (startPage > 2) {
				buttons.push(<span key="start-ellipsis" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200">...</span>);
			}
		}

		// Render page number buttons
		for (let i = startPage; i <= endPage; i++) {
			buttons.push(
				<button
					key={i}
					onClick={() => goToPage(i)}
					className={`relative inline-flex items-center px-4 py-2 border ${currentPage === i
						? "z-10 bg-green-50 dark:bg-green-900 border-green-500 text-green-600 dark:text-green-200"
						: "border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
						} text-sm font-medium`}
					aria-current={currentPage === i ? "page" : undefined}
				>
					{i}
				</button>
			);
		}

		// Show '...' and last page number if needed
		if (endPage < totalPages) {
			if (endPage < totalPages - 1) {
				buttons.push(<span key="end-ellipsis" className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200">...</span>);
			}
			buttons.push(
				<button
					key="end"
					onClick={() => goToPage(totalPages)}
					className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
				>
					{totalPages}
				</button>
			);
		}

		return buttons;
	};

	return (
		<main className="pt-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
			{/* Browse Header */}
			<header className="bg-white dark:bg-gray-800 shadow sticky top-16 z-20"> {/* Make header sticky */}
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4"> {/* Reduced padding */}
					<div className="md:flex md:items-center md:justify-between">
						<div className="flex-1 min-w-0">
							<h1 className="text-xl font-bold leading-tight text-gray-900 dark:text-white sm:text-2xl">
								Browse Sustainable Items
							</h1>
							{!isInitialLoad && (
								<p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
									{filteredListings.length} items found
									{filters.country && filters.country !== "all" ? ` in ${filters.country}` : " across Europe"}
								</p>
							)}
						</div>
						<div className="mt-4 flex items-center space-x-3 md:mt-0 md:ml-4">
							{/* View Mode Toggle */}
							<div className="hidden sm:flex items-center bg-gray-100 dark:bg-gray-700 rounded-md p-0.5">
								<button
									onClick={() => setViewMode("grid")}
									className={`p-1.5 rounded ${viewMode === "grid"
										? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm"
										: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
										}`}
									aria-label="Grid view"
								>
									<FiGrid className="h-5 w-5" />
								</button>
								<button
									onClick={() => setViewMode("list")}
									className={`p-1.5 rounded ${viewMode === "list"
										? "bg-white dark:bg-gray-600 text-green-600 dark:text-green-300 shadow-sm"
										: "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
										}`}
									aria-label="List view"
								>
									<FiList className="h-5 w-5" />
								</button>
							</div>

							{/* Sort By Dropdown */}
							<div className="relative inline-block text-left">
								<select
									id="sortBy"
									name="sortBy"
									value={filters.sortBy}
									onChange={(e) => {
										handleFilterChange("sortBy", e.target.value);
										// Trigger URL update immediately on sort change
										const params = new URLSearchParams(searchParams.toString());
										if (e.target.value === "newest") {
											params.delete("sortBy");
										} else {
											params.set("sortBy", e.target.value);
										}
										router.replace(`/browse?${params.toString()}`, { scroll: false });
									}}
									className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md bg-white dark:bg-gray-700 dark:text-white"
								>
									<option value="newest">Newest First</option>
									<option value="price-low">Price: Low to High</option>
									<option value="price-high">Price: High to Low</option>
									<option value="eco-score">Eco Score</option>
								</select>
							</div>

							{/* Mobile Filter Button */}
							<button
								onClick={() => setIsFilterOpen(!isFilterOpen)}
								className="inline-flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 lg:hidden"
							>
								<FaFilter className="mr-2 h-4 w-4" />
								Filters
							</button>
						</div>
					</div>
				</div>
			</header>

			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
				<div className="lg:grid lg:grid-cols-12 lg:gap-8">
					{/* Filters Sidebar */}
					<aside
						className={`lg:col-span-3 lg:sticky lg:top-36 self-start ${isFilterOpen ? "fixed inset-0 bg-black bg-opacity-50 z-40 lg:relative lg:inset-auto lg:bg-transparent lg:z-auto" : "hidden"} lg:block`}
					>
						{/* Mobile Filter Panel */}
						<div className={`fixed inset-y-0 left-0 w-full max-w-xs bg-white dark:bg-gray-800 shadow-xl z-50 transform transition ease-in-out duration-300 lg:hidden ${isFilterOpen ? 'translate-x-0' : '-translate-x-full'}`}>
							<div className="h-full flex flex-col overflow-y-auto p-6">
								<div className="flex justify-between items-center mb-6">
									<h2 className="text-lg font-medium text-gray-900 dark:text-white">
										Filters
									</h2>
									<button
										onClick={() => setIsFilterOpen(false)}
										className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 p-1 rounded-full -mr-1"
									>
										<FiX className="h-6 w-6" />
									</button>
								</div>
								{/* Filter Content Duplicated for Mobile */}
								<div className="space-y-6 flex-grow">
									{/* Search */}
									<div>
										<label htmlFor="search-mobile" className="sr-only">Search</label>
										<div className="relative">
											<input type="text" name="search-mobile" id="search-mobile" value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Search..." />
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiSearch className="h-5 w-5 text-gray-400" /></div>
										</div>
									</div>
									{/* Categories */}
									<div>
										<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
										<div className="space-y-1">
											{categories.map((category) => (
												<button key={category.id + '-mobile'} onClick={() => toggleCategory(category.name)} className={`flex w-full items-center py-2 px-3 rounded-md transition-colors ${filters.category === category.name ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300"}`}>
													<category.icon className={`flex-shrink-0 h-5 w-5 mr-3 ${filters.category === category.name ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
													<span className="text-sm font-medium">{category.name}</span>
													{filters.category === category.name && <svg className="ml-auto h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
												</button>
											))}
										</div>
									</div>
									{/* Price Range */}
									<div>
										<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Price Range</h3>
										<div className="flex items-center space-x-2">
											<input type="number" placeholder="Min" value={filters.minPrice || ""} onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : undefined)} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
											<span className="text-gray-500">-</span>
											<input type="number" placeholder="Max" value={filters.maxPrice || ""} onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : undefined)} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
										</div>
									</div>
									{/* Eco Score */}
									<div>
										<label htmlFor="minEcoScore-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Eco Score</label>
										<select id="minEcoScore-mobile" value={filters.minEcoScore || "0"} onChange={(e) => handleFilterChange("minEcoScore", e.target.value === "0" ? undefined : parseFloat(e.target.value))} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
											<option value="0">Any Score</option>
											<option value="3">3+ Stars</option>
											<option value="4">4+ Stars</option>
											<option value="4.5">4.5+ Stars</option>
										</select>
									</div>
									{/* Country */}
									<div>
										<label htmlFor="country-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
										<select id="country-mobile" value={filters.country} onChange={(e) => handleFilterChange("country", e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
											<option value="all">All Countries</option>
											{availableCountries.map((country) => (<option key={country + '-mobile'} value={country}>{country}</option>))}
										</select>
									</div>
									{/* Condition */}
									<div>
										<label htmlFor="condition-mobile" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
										<select id="condition-mobile" value={filters.condition} onChange={(e) => handleFilterChange("condition", e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
											<option value="all">Any Condition</option>
											<option value="New">New</option>
											<option value="Like New">Like New</option>
											<option value="Good">Good</option>
											<option value="Fair">Fair</option>
										</select>
									</div>
								</div>
								{/* Apply Button for Mobile */}
								<div className="mt-auto pt-6 border-t border-gray-200 dark:border-gray-700">
									<button
										onClick={applyFilters}
										className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
									>
										Apply Filters
									</button>
								</div>
							</div>
						</div>
						{/* Desktop Filter Panel (always rendered but hidden on small screens) */}
						<div className="hidden lg:block lg:sticky lg:top-36 self-start bg-white dark:bg-gray-800 rounded-lg shadow p-6">
							<h2 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
								Filters
							</h2>
							{/* Filter Content for Desktop */}
							<div className="space-y-6">
								{/* Search */}
								<div>
									<label htmlFor="search-desktop" className="sr-only">Search</label>
									<div className="relative">
										<input type="text" name="search-desktop" id="search-desktop" value={filters.search} onChange={(e) => handleFilterChange("search", e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') applyFilters(); }} className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" placeholder="Search..." />
										<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><FiSearch className="h-5 w-5 text-gray-400" /></div>
									</div>
								</div>
								{/* Categories */}
								<div>
									<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Categories</h3>
									<div className="space-y-1">
										{categories.map((category) => (
											<button key={category.id + '-desktop'} onClick={() => toggleCategory(category.name)} className={`flex cursor-pointer w-full items-center py-2 px-3 rounded-md transition-colors ${filters.category === category.name ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "hover:bg-gray-50 dark:hover:bg-gray-700/30 text-gray-700 dark:text-gray-300"}`}>
												<category.icon className={`flex-shrink-0 h-5 w-5 mr-3 ${filters.category === category.name ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`} />
												<span className="text-sm font-medium">{category.name}</span>
												{filters.category === category.name && <svg className="ml-auto h-4 w-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>}
											</button>
										))}
									</div>
								</div>
								{/* Price Range */}
								<div>
									<h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Price Range</h3>
									<div className="flex items-center space-x-2">
										<input type="number" placeholder="Min" value={filters.minPrice || ""} onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : undefined)} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
										<span className="text-gray-500">-</span>
										<input type="number" placeholder="Max" value={filters.maxPrice || ""} onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : undefined)} className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm" />
									</div>
								</div>
								{/* Eco Score */}
								<div>
									<label htmlFor="minEcoScore-desktop" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Minimum Eco Score</label>
									<select id="minEcoScore-desktop" value={filters.minEcoScore || "0"} onChange={(e) => handleFilterChange("minEcoScore", e.target.value === "0" ? undefined : parseFloat(e.target.value))} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
										<option value="0">Any Score</option>
										<option value="3">3+ Stars</option>
										<option value="4">4+ Stars</option>
										<option value="4.5">4.5+ Stars</option>
									</select>
								</div>
								{/* Country */}
								<div>
									<label htmlFor="country-desktop" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Country</label>
									<select id="country-desktop" value={filters.country} onChange={(e) => handleFilterChange("country", e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
										<option value="all">All Countries</option>
										{availableCountries.map((country) => (<option key={country + '-desktop'} value={country}>{country}</option>))}
									</select>
								</div>
								{/* Condition */}
								<div>
									<label htmlFor="condition-desktop" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Condition</label>
									<select id="condition-desktop" value={filters.condition} onChange={(e) => handleFilterChange("condition", e.target.value)} className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white">
										<option value="all">Any Condition</option>
										<option value="New">New</option>
										<option value="Like New">Like New</option>
										<option value="Good">Good</option>
										<option value="Fair">Fair</option>
									</select>
								</div>
								{/* Apply Button for Desktop */}
								<Button
									onClick={applyFilters}
									className="w-full"
									variant={"default"}
								>
									Apply Filters
								</Button>
								<Button
									onClick={() => {
										setFilters({
											category: "All Categories",
											search: "",
											country: "all",
											minPrice: undefined,
											maxPrice: undefined,
											minEcoScore: undefined,
											condition: "all",
											sortBy: "newest"
										});
										applyFilters();
									}}
									className="w-full hover:bg-gray-200! hover:text-primary"
									variant={"outline"}
								>
									Clear Filters
								</Button>
							</div>
						</div>
					</aside>

					{/* Listings */}
					<div className="mt-6 lg:mt-0 lg:col-span-9">
						{isInitialLoad ? (
							<div className="text-center py-12">
								<p className="text-lg font-medium text-gray-900 dark:text-gray-100">Loading listings...</p>
								{/* Optional: Add a spinner component here */}
							</div>
						) : currentListings.length > 0 ? (
							<> { /* Wrap listings and pagination in a fragment */}
								{viewMode === "grid" ? (
									<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
										{currentListings.map((listing) => (
											<ListingCard key={listing.id} listing={listing} viewMode="grid" />
										))}
									</div>
								) : (
									<div className="space-y-4">
										{currentListings.map((listing) => (
											<ListingCard key={listing.id} listing={listing} viewMode="list" />
										))}
									</div>
								)}

								{/* Pagination */}
								{totalPages > 1 && ( // Only show pagination if there's more than one page
									<div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
										<div className="flex-1 flex justify-between sm:hidden">
											<button
												onClick={goToPreviousPage}
												disabled={currentPage === 1}
												className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Previous
											</button>
											<button
												onClick={goToNextPage}
												disabled={currentPage === totalPages}
												className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												Next
											</button>
										</div>
										<div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
											<div>
												<p className="text-sm text-gray-700 dark:text-gray-300">
													Showing <span className="font-medium">{startIndex + 1}</span> to <span className="font-medium">{Math.min(endIndex, filteredListings.length)}</span> of{' '}
													<span className="font-medium">{filteredListings.length}</span> results
												</p>
											</div>
											<div>
												<nav
													className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
													aria-label="Pagination"
												>
													<button
														onClick={goToPreviousPage}
														disabled={currentPage === 1}
														className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
													>
														<span className="sr-only">Previous</span>
														<FiChevronDown className="h-5 w-5 rotate-90" />
													</button>

													{renderPaginationButtons()}

													<button
														onClick={goToNextPage}
														disabled={currentPage === totalPages}
														className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
													>
														<span className="sr-only">Next</span>
														<FiChevronDown className="h-5 w-5 -rotate-90" />
													</button>
												</nav>
											</div>
										</div>
									</div>
								)}
							</>
						) : (
							<div className="text-center py-12">
								<h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No listings found</h3>
								<p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
									Try adjusting your filters or search criteria
								</p>
								{/* Keep the clear category button logic */}
								{filters.category !== "All Categories" && (
									<button
										onClick={() => {
											toggleCategory("All Categories");
											applyFilters(); // Apply immediately after clearing
										}}
										className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
									>
										Clear Category Filter
									</button>
								)}
							</div>
						)}
					</div>
				</div>
			</div>
		</main>
	);
};

const BrowsePage = () => {
	const [queryClient] = useState(() => new QueryClient());
	return (
		// Wrap BrowserComponent in Suspense for searchParams hook
		<Suspense fallback={<div>Loading Filters...</div>}>
			<QueryClientProvider client={queryClient}>
				<BrowserComponent />
			</QueryClientProvider>
		</Suspense>
	)
}

export default BrowsePage;
