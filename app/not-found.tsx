"use client";

import Link from 'next/link';
import { FaLeaf, FaHome, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <motion.div 
        className="max-w-md w-full p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <FaLeaf className="text-green-500 h-20 w-20" />
          </div>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8">
          Oops! The sustainable resource you&apos;re looking for seems to have been recycled.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="flex items-center justify-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800 text-white rounded-lg transition-colors">
            <FaHome className="h-4 w-4" />
            <span>Return Home</span>
          </Link>
          <Link href="/browse" className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 rounded-lg transition-colors">
            <FaSearch className="h-4 w-4" />
            <span>Browse Items</span>
          </Link>
        </div>
      </motion.div>
      
      <div className="mt-8 text-gray-500 dark:text-gray-400 flex flex-col items-center">
        <p className="mb-4">Need help finding something?</p>
        <Link 
          href="/contact" 
          className="inline-flex items-center text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
        >
          <FaArrowLeft className="mr-2 h-4 w-4" />
          Contact Support
        </Link>
      </div>
    </div>
  );
}