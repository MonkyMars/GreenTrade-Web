"use client";

import { useEffect, useState } from "react";
import api from "@/lib/backend/api/axiosConfig";
import { Seller } from "@/lib/types/seller";
import { useParams } from "next/navigation";

const getSeller = async (sellerId: string) => {
  try {
    const response = await api.get(`/api/sellers/${sellerId}`);

    if (!response.data || !response.data.success) {
      throw new Error(
        'Failed to fetch seller: Server returned unsuccessful response'
      );
    }
    return response.data.data;
  } catch (error) {
    console.error('Get seller error:', error);
    throw error;
  }
};

const SellersPage = () => {
  const [sellerData, setSellerData] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const params = useParams();

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const sellerId = params.id as string;
        if (!sellerId) {
          setError("Seller ID is missing");
          setLoading(false);
          return;
        }
        const data = await getSeller(sellerId);
        setSellerData(data);
      } catch (err) {
        console.error("Error fetching seller:", err);
        setError("Failed to load seller data");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [params]);

  if (loading) {
    return <div>Loading seller information...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!sellerData) {
    return <div>Error fetching seller data</div>;
  }

  return (
    <main className="mx-auto px-4 py-8 max-w-7xl">
      <h1>Sellers Page</h1>
      <p>Seller ID: {params.id}</p>
      <div>
        {/* Display seller data here */}
        <h2>{sellerData.name}</h2>
        {/* Add more seller information as needed */}
      </div>
    </main>
  );
};

export default SellersPage;
