'use client';

import { usePathname } from 'next/navigation';
import Footer from './Footer';

export const FooterWrapper = () => {
	const pathname = usePathname();
	// Don't show footer on messages page
	const showFooter = !pathname.includes('/messages');

	return showFooter ? <Footer /> : null;
};
