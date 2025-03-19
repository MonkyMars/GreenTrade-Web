"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLeaf, FaMapMarkerAlt, FaHeart, FaRegHeart, FaLocationArrow } from "react-icons/fa";
import { FiChevronLeft, FiChevronRight, FiSearch, FiSliders, FiX } from "react-icons/fi";
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import MarkerClusterGroup from 'react-leaflet-cluster';

const fixLeafletIcons = () => {;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: '/images/map/marker-icon-2x.png',
    iconUrl: '/images/map/marker-icon.png',
    shadowUrl: '/images/map/marker-shadow.png',
  });
};

// Custom marker icons
const createCustomIcon = (isSelected: boolean) => {
  return new L.Icon({
    iconUrl: isSelected 
      ? '/images/map/marker-green.png' 
      : '/images/map/marker-red.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowUrl: '/images/map/marker-shadow.png',
    shadowSize: [41, 41],
  });
};

// Component to recenter map when user location changes
function ChangeMapView({ center }: { center: [number, number] }) {
  const map = useMap();
  map.setView(center, 13);
  return null;
}

// Component to handle moving map to user location
function LocationButton({ setUserLocation }: { setUserLocation: (location: {lat: number; lng: number}) => void }) {
  const map = useMap();
  
  const handleLocationRequest = () => {
    map.locate({ setView: true, maxZoom: 16 });
    
    map.on('locationfound', function(e: L.LocationEvent) {
      setUserLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    });
  };
  
  return (
    <button 
      onClick={handleLocationRequest}
      className="absolute bottom-24 right-4 z-500 p-3 bg-white dark:bg-gray-800 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-700"
      style={{ zIndex: 1000 }}
    >
      <FaLocationArrow className="h-5 w-5 text-blue-600 dark:text-blue-400" />
    </button>
  );
}

const MapPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchRadius, setSearchRadius] = useState(10); // km
  const [selectedListing, setSelectedListing] = useState<number | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Default center of map (Berlin)
  const berlinCenter: [number, number] = [52.520008, 13.404954];
  const mapRef = useRef<L.Map | null>(null);

  // Mock listings data with geo coordinates
  const listings = [
    {
      id: 1,
      title: "Handmade Wooden Desk",
      price: "€120",
      location: "Berlin, Germany",
      coords: { lat: 52.520008, lng: 13.404954 },
      image: "/test.jpg",
      ecoScore: 4.8,
      distance: "2.3 km away",
      isFavorite: false,
    },
    {
      id: 2,
      title: "Solar-Powered Charger",
      price: "€45",
      location: "Berlin, Germany",
      coords: { lat: 52.523089, lng: 13.413215 },
      image: "/test.jpg",
      ecoScore: 5.0,
      distance: "3.5 km away",
      isFavorite: true,
    },
    {
      id: 3,
      title: "Sustainable Fashion Bundle",
      price: "€75",
      location: "Berlin, Germany",
      coords: { lat: 52.516266, lng: 13.378125 },
      image: "/test.jpg",
      ecoScore: 4.5,
      distance: "1.8 km away",
      isFavorite: false,
    },
    {
      id: 4,
      title: "Refurbished Laptop",
      price: "€350",
      location: "Berlin, Germany",
      coords: { lat: 52.530644, lng: 13.413879 },
      image: "/test.jpg",
      ecoScore: 4.2,
      distance: "4.7 km away",
      isFavorite: false,
    },
    {
      id: 5,
      title: "Bamboo Kitchenware Set",
      price: "€65",
      location: "Berlin, Germany",
      coords: { lat: 52.510872, lng: 13.391066 },
      image: "/test.jpg",
      ecoScore: 4.9,
      distance: "2.1 km away",
      isFavorite: false,
    },
  ];

  // Toggle favorite status
  const toggleFavorite = (id: number) => {
    // In a real app, this would call an API
    console.log(`Toggle favorite for item ${id}`);
  };

  // Initialize leaflet on client side
  useEffect(() => {
   
      fixLeafletIcons();
      setMapInitialized(true);
      setIsLoading(false);
    
  }, []);

  // Select a listing and pan map to it
  const selectListingAndPanMap = (id: number) => {
    setSelectedListing(id);
    const listing = listings.find(l => l.id === id);
    if (listing && mapRef.current) {
      mapRef.current.setView(
        [listing.coords.lat, listing.coords.lng], 
        15, 
        { animate: true }
      );
    }
  };

  return (
    <main className="pt-16 h-screen flex flex-col">
      {/* Map Container */}
      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar */}
        <div 
          className={`absolute md:relative z-10 h-full bg-white dark:bg-gray-800 shadow-lg transition-all duration-300 ${
            isSidebarOpen ? 'w-full md:w-96 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-20'
          } flex flex-col`}
          style={{ zIndex: 1001 }} // Above map
        >
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
            <h1 className={`text-xl font-bold text-gray-900 dark:text-white ${!isSidebarOpen && 'md:hidden'}`}>
              Nearby Items
            </h1>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              aria-label={isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isSidebarOpen ? (
                <FiChevronLeft className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              ) : (
                <FiChevronRight className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              )}
            </button>
          </div>

          {isSidebarOpen && (
            <>
              {/* Search and filters */}
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <div className="relative mb-4">
                  <input
                    type="text"
                    placeholder="Search in this area"
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  />
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiSearch className="h-4 w-4 text-gray-400" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <h2 className="font-medium text-gray-700 dark:text-gray-300">Search Radius</h2>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{searchRadius} km</span>
                </div>
                
                <input
                  type="range"
                  min="1"
                  max="50"
                  value={searchRadius}
                  onChange={(e) => setSearchRadius(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                />
                
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <span>1 km</span>
                  <span>25 km</span>
                  <span>50 km</span>
                </div>
                
                <button 
                  onClick={() => setIsFilterOpen(true)}
                  className="mt-3 w-full flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <FiSliders className="mr-2 h-4 w-4" />
                  More Filters
                </button>
              </div>
              
              {/* Listings */}
              <div className="flex-1 overflow-y-auto">
                {listings.map((listing) => (
                  <div 
                    key={listing.id} 
                    className={`p-4 border-b border-gray-200 dark:border-gray-700 flex hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors ${
                      selectedListing === listing.id ? 'bg-green-50 dark:bg-green-900' : ''
                    }`}
                    onClick={() => selectListingAndPanMap(listing.id)}
                  >
                    <div className="relative h-20 w-20 flex-shrink-0 rounded-md overflow-hidden">
                      <Image 
                        src={listing.image} 
                        alt={listing.title} 
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                      <div className="absolute bottom-1 left-1 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-1 py-0.5 rounded text-xs font-medium flex items-center">
                        <FaLeaf className="h-3 w-3 text-green-500 mr-0.5" />
                        <span>{listing.ecoScore}</span>
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">{listing.title}</h3>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(listing.id);
                          }}
                        >
                          {listing.isFavorite ? (
                            <FaHeart className="h-4 w-4 text-red-500" />
                          ) : (
                            <FaRegHeart className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                          )}
                        </button>
                      </div>
                      <p className="mt-1 text-green-600 dark:text-green-400 font-medium">{listing.price}</p>
                      <div className="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <FaMapMarkerAlt className="mr-1" />
                        <span>{listing.distance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Map */}
        <div className="relative flex-1">
          {isLoading ? (
            <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
              </div>
            </div>
          ) : mapInitialized && (
            <MapContainer
              center={berlinCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
            >
              {/* OpenStreetMap tiles - free and open source */}
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Search radius circle around user location */}
              {userLocation && (
                <Circle 
                  center={[userLocation.lat, userLocation.lng]}
                  radius={searchRadius * 1000} // Convert km to meters
                  pathOptions={{ 
                    color: '#10B981',
                    fillColor: '#10B981',
                    fillOpacity: 0.1,
                  }}
                />
              )}
              
              {/* Marker clustering for better performance with many markers */}
              <MarkerClusterGroup
                chunkedLoading
                disableClusteringAtZoom={14}
              >
                {listings.map((listing) => (
                  <Marker 
                    key={listing.id} 
                    position={[listing.coords.lat, listing.coords.lng]} 
                    icon={createCustomIcon(selectedListing === listing.id)}
                    eventHandlers={{
                      click: () => {
                        setSelectedListing(listing.id);
                      }
                    }}
                  >
                    <Popup closeButton={false} className="custom-popup appearance-none">
                      <div className="w-72 overflow-hidden rounded-lg shadow-md">
                        <div className="relative h-40 w-full">
                          <Image 
                            src={listing.image} 
                            alt={listing.title} 
                            fill
                            style={{ objectFit: 'cover' }}
                            className="rounded-t-lg"
                          />
                          <div className="absolute top-2 right-2 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 p-1.5 rounded-full shadow-sm">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleFavorite(listing.id);
                              }}
                            >
                              {listing.isFavorite ? (
                                <FaHeart className="h-4 w-4 text-red-500" />
                              ) : (
                                <FaRegHeart className="h-4 w-4 text-gray-500 hover:text-red-500 transition-colors" />
                              )}
                            </button>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-white dark:bg-gray-800 bg-opacity-90 dark:bg-opacity-90 px-2 py-1 rounded-full text-xs font-medium flex items-center shadow-sm">
                            <FaLeaf className="h-3 w-3 text-green-500 mr-1" />
                            <span className="font-bold">{listing.ecoScore}</span>
                          </div>
                        </div>
                        <div className="p-3 bg-white dark:bg-gray-800">
                          <h3 className="font-semibold text-gray-800 dark:text-white text-base mb-1">{listing.title}</h3>
                          <p className="text-green-600 dark:text-green-400 font-bold text-lg">{listing.price}</p>
                          <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-1.5">
                            <FaMapMarkerAlt className="mr-1.5" />
                            <span>{listing.distance}</span>
                          </div>
                          <Link 
                            href={`/listing/${listing.id}`}
                            className="mt-3 block text-center py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors duration-200 ease-in-out transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            View Details
                          </Link>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MarkerClusterGroup>
              
              {/* User location marker */}
              {userLocation && (
                <Marker 
                  position={[userLocation.lat, userLocation.lng]}
                  icon={new L.Icon({
                    iconUrl: '/images/map/user-location.png',
                    iconSize: [20, 20],
                    iconAnchor: [10, 10],
                  })}
                >
                  <Popup>
                    <span>You are here</span>
                  </Popup>
                </Marker>
              )}
              
              {/* Update map view when user location changes */}
              {userLocation && (
                <ChangeMapView center={[userLocation.lat, userLocation.lng]} />
              )}
              
              {/* Custom map controls */}
              <LocationButton setUserLocation={setUserLocation} />
            </MapContainer>
          )}
        </div>
      </div>

      {/* Filter modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[1100] overflow-y-auto"> {/* Higher z-index than map */}
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" onClick={() => setIsFilterOpen(false)}></div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                    Filter Map Results
                  </h3>
                  <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <FiX className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Filter options */}
                <div className="space-y-6">
                  {/* Categories */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Categories
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {["All", "Home & Garden", "Fashion", "Electronics", "Vehicles", "Services"].map((cat) => (
                        <div key={cat} className="flex items-center">
                          <input
                            id={`cat-${cat}`}
                            name="category"
                            type="checkbox"
                            className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                          />
                          <label htmlFor={`cat-${cat}`} className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                            {cat}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Price Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Price Range
                    </label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="number"
                        placeholder="Min"
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                      <span className="text-gray-500">-</span>
                      <input
                        type="number"
                        placeholder="Max"
                        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  {/* Eco Score */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Minimum Eco Score
                    </label>
                    <select 
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="0">Any Score</option>
                      <option value="3">3+ Stars</option>
                      <option value="4">4+ Stars</option>
                      <option value="4.5">4.5+ Stars</option>
                    </select>
                  </div>
                
                  {/* Recently added */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Listed Within
                    </label>
                    <select 
                      className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-700 dark:text-white"
                    >
                      <option value="any">Any Time</option>
                      <option value="day">Last 24 Hours</option>
                      <option value="week">Last Week</option>
                      <option value="month">Last Month</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Apply Filters
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setIsFilterOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default MapPage;