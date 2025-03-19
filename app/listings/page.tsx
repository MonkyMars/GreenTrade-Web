"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import BrowsePage from "../browse/page";
export default function ListingPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/browse")
  }, [router]);

  return (<BrowsePage/>);
}