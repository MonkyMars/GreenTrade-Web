import axios from "axios";
import { FetchedSeller } from "@/lib/types/seller";

async function fetchSellerData(id: string): Promise<FetchedSeller | null> {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL_PROTECTED}/sellers/${id}`
    );

    if (!response.data.success) {
      throw new Error("Failed to fetch seller data");
    }

    return response.data.data as FetchedSeller;
  } catch (error) {
    console.error("Error fetching seller data:", error);
    return null;
  }
}

const SellersPage = async ({ params }: { params: { id: string } }) => {
	const awaitedParams = await params;
  const sellerData = await fetchSellerData(awaitedParams.id);

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
