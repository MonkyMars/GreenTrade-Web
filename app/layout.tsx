import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Navigation from '../components/ui/Navigation';
import { FooterWrapper } from '../components/ui/FooterWrapper';
import { AuthProvider } from '@/lib/contexts/AuthContext';
import { EmailConfirmationBar } from '@/components/ui/EmailConfirmationBar';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/sonner';
import ConstructionBanner from '@/components/ui/ConstuctionBanner';
import { QueryProvider } from '@/components/providers/QueryProvider';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	metadataBase: new URL('https://greenvue.eu'),
	title: 'GreenVue - Sustainable Trading Solutions',
	description:
		'GreenVue offers eco-friendly trading solutions focused on sustainability and environmental responsibility.',
	keywords: [
		'green trading',
		'sustainable finance',
		'eco-friendly investments',
		'environmental markets',
	],
	authors: [{ name: 'GreenVue Team' }],
	creator: 'GreenVue',
	publisher: 'GreenVue EU',
	icons: {
		icon: [
			{ url: '/icon.png', sizes: '16x16' },
			{ url: '/icon.png', sizes: '32x32' },
		],
		// apple: { url: "/apple-touch-icon.png" },
		other: [
			{ rel: 'mask-icon', url: '/safari-pinned-tab.svg' },
			{ rel: 'msapplication-TileImage', url: '/mstile-150x150.png' },
		],
	},
	openGraph: {
		title: 'GreenVue - Sustainable Trading Solutions',
		description:
			'Eco-friendly trading platform for environmentally conscious investors',
		url: 'https://greenvue.eu',
		siteName: 'GreenVue',
		locale: 'en_US',
		images: ['/images/logo.png'],
		type: 'website',
	},
	twitter: {
		card: 'summary_large_image',
		title: 'GreenVue - Sustainable Trading Solutions',
		description:
			'Eco-friendly trading platform for environmentally conscious investors',
	},
	robots: 'index, follow',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	minimumScale: 1,
	maximumScale: 1,
	userScalable: false,
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
			>
				<Analytics />
				<AuthProvider>
					<Navigation />
					<ConstructionBanner />
					<EmailConfirmationBar />
					<QueryProvider>
						{children}
					</QueryProvider>
					<Toaster toastOptions={{ className: "rounded-xl! shadow-md! bg-white! dark:bg-gray-900! border! border-gray-200! dark:border-gray-800! hover:border-green-200! dark:hover:border-green-800! text-gray-900! dark:text-gray-100! transition-all! duration-300!" }} />
					<FooterWrapper />
				</AuthProvider>
			</body>
		</html>
	);
}
