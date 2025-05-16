import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'hxlhtgitnqjjnuvalsmh.supabase.co',
				port: '',
			},
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
				port: '',
			},
		],
		// Optimize image quality and formats
		formats: ['image/avif', 'image/webp'],
		minimumCacheTTL: 60,
		dangerouslyAllowSVG: true,
		contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
	},
	// Improve page performance
	reactStrictMode: true,
	poweredByHeader: false,
	compress: true,
	// Cache improvements
	onDemandEntries: {
		// period (in ms) where the server will keep pages in the buffer
		maxInactiveAge: 25 * 1000,
		// number of pages that should be kept simultaneously without being disposed
		pagesBufferLength: 2,
	},
};

export default nextConfig;
