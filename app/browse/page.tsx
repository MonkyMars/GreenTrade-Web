"use client";

import { Suspense, useEffect, useState } from "react";
import {
  FaFilter,
} from "react-icons/fa";
import { FiSearch, FiGrid, FiList, FiX } from "react-icons/fi";
import { FetchedListing } from "../../lib/types/main";
import { getListings } from "@/lib/backend/listings/getListings";
import { Categories, categories } from "@/lib/functions/categories";
import { useRouter, useSearchParams } from "next/navigation";
import ListingCard from "../../components/ui/ListingCard";
import { FilterOptions, filterListings, extractCountry } from "./filtering";

const BrowserComponent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // const [currentPage, setCurrentPage] = useState(1);
  const [allListings, setAllListings] = useState<FetchedListing[]>([]);
  const [filteredListings, setFilteredListings] = useState<FetchedListing[]>([]);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  
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

  // Load all listings once
  useEffect(() => {
    const fetchListings = async () => {
      const data = await getListings();
      setAllListings(data as FetchedListing[]);
      setFilteredListings(data as FetchedListing[]);
      setIsInitialLoad(false);
    };
    fetchListings();
  }, []);

  // Process URL search parameters on page load and parameter changes
  useEffect(() => {
    if (isInitialLoad) return;
    
    const category = searchParams.get("category") as Categories["name"] || "All Categories";
    const search = searchParams.get("search") || "";
    const country = searchParams.get("country") || "all";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const minEcoScore = searchParams.get("minEcoScore");
    const condition = searchParams.get("condition") || "all";
    const sortBy = searchParams.get("sortBy") || "newest";

    // Update filters from URL params without triggering re-render cascades
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
  }, [searchParams, isInitialLoad]);

  // Apply filters whenever they change or when listings are loaded
  useEffect(() => {
    if (allListings.length > 0) {
      const filtered = filterListings(allListings, filters);
      setFilteredListings(filtered);
    }
  }, [filters, allListings]);

  // Update URL with current filter state - this function is called directly, not in setTimeout
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
    
    router.push(`/browse?${params.toString()}`, { scroll: false });
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
    // Update filters state first
    setFilters(prev => ({ 
      ...prev, 
      category: categoryName
    }));
    
    // Then update URL immediately to keep in sync
    const params = new URLSearchParams(searchParams.toString());
    if (categoryName === "All Categories") {
      params.delete("category");
    } else {
      params.set("category", categoryName);
    }
    
    router.push(`/browse?${params.toString()}`, { scroll: false });
  };

  // Handle filter input changes
  const handleFilterChange = (name: keyof FilterOptions, value: string | number | undefined) => {
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // Apply all filters and update URL
  const applyFilters = () => {
    updateURL();
  };

  return (
    <main className="pt-16 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Browse Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white sm:text-3xl">
                Browse Sustainable Items
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {filteredListings.length} items found
                {filters.country && filters.country !== "all" ? ` in ${filters.country}` : " across Europe"}
              </p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 md:hidden"
              >
                <FaFilter className="mr-2 h-4 w-4" />
                Filters
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid"
                    ? "text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300"
                    : "text-gray-500 dark:text-gray-400"
                    } rounded-l-md`}
                >
                  <FiGrid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list"
                    ? "text-green-600 bg-green-50 dark:bg-green-900 dark:text-green-300"
                    : "text-gray-500 dark:text-gray-400"
                    } rounded-r-md`}
                >
                  <FiList className="h-5 w-5" />
                </button>
              </div>

              <div className="relative inline-block text-left">
                <select
                  value={filters.sortBy}
                  onChange={(e) => {
                    const params = new URLSearchParams(searchParams.toString());
                    if (e.target.value === "newest") {
                      params.delete("sortBy");
                    } else {
                      params.set("sortBy", e.target.value);
                    }
                    router.push(`/browse?${params.toString()}`, { scroll: false });
                    handleFilterChange("sortBy", e.target.value);
                  }}
                  className="block pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="eco-score">Eco Score</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters Sidebar */}
          <aside
            className={`lg:col-span-3 ${isFilterOpen ? "block" : "hidden"
              } lg:block`}
          >
            <div className="sticky top-20 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-center mb-4 lg:hidden">
                <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                  Filters
                </h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FiX className="h-5 w-5" />
                </button>
              </div>

              {/* Search */}
              <div className="mb-6">
                <label
                  htmlFor="search"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Search
                </label>
                <div className="relative rounded-md shadow-sm">
                  <input
                    type="text"
                    name="search"
                    id="search"
                    value={filters.search}
                    onChange={(e) => handleFilterChange("search", e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        applyFilters();
                      }
                    }}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    placeholder="What are you looking for?"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-5 w-5 text-gray-400" />
                  </div>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Categories
                </h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => toggleCategory(category.name)}
                        className={`flex w-full items-center py-2 px-3 rounded-md transition-colors cursor-pointer ${filters.category === category.name
                          ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                          : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                          }`}
                      >
                        <div
                          className={`flex-shrink-0 flex items-center justify-center h-6 w-6 ${filters.category === category.name
                            ? "text-green-600 dark:text-green-400"
                            : "text-gray-500 dark:text-gray-400"
                            }`}
                        >
                          <category.icon className="h-5 w-5" />
                        </div>
                        <span
                          className={`ml-3 text-sm font-medium ${filters.category === category.name
                            ? "text-green-700 dark:text-green-300"
                            : "text-gray-700 dark:text-gray-300"
                            }`}
                        >
                          {category.name}
                        </span>
                        {filters.category === category.name && (
                          <div className="ml-auto flex-shrink-0 text-green-600 dark:text-green-400">
                            <svg
                              className="h-4 w-4"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </button>
                    ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Price Range
                </h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={filters.minPrice || ""}
                    onChange={(e) => handleFilterChange("minPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={filters.maxPrice || ""}
                    onChange={(e) => handleFilterChange("maxPrice", e.target.value ? parseFloat(e.target.value) : undefined)}
                    className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                  />
                </div>
              </div>

              {/* Eco Score */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Minimum Eco Score
                </h3>
                <select
                  value={filters.minEcoScore || "0"}
                  onChange={(e) => handleFilterChange("minEcoScore", e.target.value === "0" ? undefined : parseFloat(e.target.value))}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="0">Any Score</option>
                  <option value="3">3+ Stars</option>
                  <option value="4">4+ Stars</option>
                  <option value="4.5">4.5+ Stars</option>
                </select>
              </div>

              {/* Country (extracted from location) */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Country
                </h3>
                <select
                  value={filters.country}
                  onChange={(e) => handleFilterChange("country", e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">All Countries</option>
                  {availableCountries.map((country) => (
                    <option key={country} value={country}>
                      {country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Condition */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Condition
                </h3>
                <select
                  value={filters.condition}
                  onChange={(e) => handleFilterChange("condition", e.target.value)}
                  className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="all">Any Condition</option>
                  <option value="New">New</option>
                  <option value="Like New">Like New</option>
                  <option value="Good">Good</option>
                  <option value="Fair">Fair</option>
                </select>
              </div>

              <button 
                onClick={applyFilters}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Listings */}
          <div className="mt-6 lg:mt-0 lg:col-span-9">
            {isInitialLoad ? (
              <div className="text-center py-12">
                <p className="text-lg font-medium text-gray-900 dark:text-gray-100">Loading listings...</p>
                {/* Optional: Add a spinner component here if available */}
              </div>
            ) : filteredListings.length > 0 ? (
              viewMode === "grid" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredListings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} viewMode="grid" />
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                     <ListingCard key={listing.id} listing={listing} viewMode="list" />
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12">
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">No listings found</h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                  Try adjusting your filters or search criteria
                </p>
                {filters.category !== "All Categories" && (
                  <button
                    onClick={() => toggleCategory("All Categories")}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    Clear Category Filter
                  </button>
                )}
              </div>
            )}

            {/* Pagination (simplified to just show when we have results and not loading) */}
            {!isInitialLoad && filteredListings.length > 0 && (
              <div className="mt-8 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-6">
                {/* ... existing pagination code ... */}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

const BrowsePage = () => {
  return (
    <Suspense>
      <BrowserComponent />
    </Suspense>
  )
}

export default BrowsePage;
