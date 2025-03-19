import React from 'react';
import Link from 'next/link';
import { FaLeaf, FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaHeart } from 'react-icons/fa';
import { FiMail } from 'react-icons/fi';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
      {/* Newsletter section */}
      <div className="bg-green-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-0 lg:flex-1">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                Join our sustainable community
              </h3>
              <p className="mt-3 max-w-3xl text-lg text-gray-600 dark:text-gray-300">
                Get tips for sustainable living and be the first to hear about new eco-friendly items in your area.
              </p>
            </div>
            <div className="mt-8 lg:mt-0 lg:ml-8">
              <form className="sm:flex">
                <label htmlFor="email-address" className="sr-only">Email address</label>
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
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8">
        <div className="xl:grid xl:grid-cols-4 xl:gap-8">
          {/* Logo and about */}
          <div className="space-y-8 xl:col-span-1">
            <Link href="/" className="flex items-center">
              <FaLeaf className="h-8 w-8 text-green-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                GreenTrade<span className="text-green-500">.eu</span>
              </span>
            </Link>
            <p className="text-gray-600 dark:text-gray-300 text-base">
              Making sustainable trading accessible across Europe since 2025. Creating a greener future, one trade at a time.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-green-500">
                <span className="sr-only">Twitter</span>
                <FaTwitter className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500">
                <span className="sr-only">Facebook</span>
                <FaFacebook className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500">
                <span className="sr-only">Instagram</span>
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-gray-500 hover:text-green-500">
                <span className="sr-only">LinkedIn</span>
                <FaLinkedin className="h-6 w-6" />
              </a>
            </div>
          </div>

          {/* Links sections */}
          <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-3">
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Marketplace
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/browse" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Browse Items
                    </Link>
                  </li>
                  <li>
                    <Link href="/post" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Post an Ad
                    </Link>
                  </li>
                  <li>
                    <Link href="/featured" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Featured Items
                    </Link>
                  </li>
                  <li>
                    <Link href="/map" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Map View
                    </Link>
                  </li>
                  <li>
                    <Link href="/sustainability" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Sustainability Score
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categories
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/category/home-garden" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Home & Garden
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/fashion" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Fashion
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/electronics" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Electronics
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/vehicles" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Vehicles
                    </Link>
                  </li>
                  <li>
                    <Link href="/category/services" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Services
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="md:grid md:grid-cols-2 md:gap-8">
              <div>
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Company
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/about" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/blog" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Blog
                    </Link>
                  </li>
                  <li>
                    <Link href="/impact" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Environmental Impact
                    </Link>
                  </li>
                  <li>
                    <Link href="/press" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Press
                    </Link>
                  </li>
                  <li>
                    <Link href="/careers" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Careers
                    </Link>
                  </li>
                </ul>
              </div>
              <div className="mt-12 md:mt-0">
                <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Support
                </h3>
                <ul className="mt-4 space-y-4">
                  <li>
                    <Link href="/help" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Help Center
                    </Link>
                  </li>
                  <li>
                    <Link href="/safety" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Safety Tips
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Terms of Service
                    </Link>
                  </li>
                  <li>
                    <Link href="/privacy" className="text-base text-gray-600 dark:text-gray-300 hover:text-green-500 dark:hover:text-green-400">
                      Privacy Policy
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Country selector */}
        <div className="mt-12 border-t border-gray-200 dark:border-gray-700 pt-8">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Country
              </h3>
              <select 
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
              >
                <option value="eu">All Europe</option>
                <option value="de">Germany</option>
                <option value="fr">France</option>
                <option value="it">Italy</option>
                <option value="es">Spain</option>
                <option value="nl">Netherlands</option>
                <option value="se">Sweden</option>
              </select>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 tracking-wider">
                Language
              </h3>
              <select 
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md dark:bg-gray-800 dark:text-white"
              >
                <option value="en">English</option>
                {/* <option value="de">Deutsch</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
                <option value="nl">Nederlands</option>
                <option value="sv">Svenska</option> */}
              </select>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <p className="text-base text-gray-500 dark:text-gray-400">
              Made with <FaHeart className="inline h-4 w-4 text-green-500" /> for a greener Europe
            </p>
          </div>
          <p className="mt-8 text-base text-gray-500 dark:text-gray-400 md:mt-0 md:order-1">
            &copy; {new Date().getFullYear()} GreenTrade.eu. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;