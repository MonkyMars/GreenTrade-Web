'use client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import BrowsePage from '../browse/page';
import { NextPage } from 'next';

const ListingPage: NextPage = () => {
	const router = useRouter();
	useEffect(() => {
		router.replace('/browse');
	}, [router]);

	return <BrowsePage />;
};

export default ListingPage;
