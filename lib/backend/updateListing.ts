export const updateListing = async (listingId: number, updates: unknown) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/listings/${listingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
  
      if (!response.ok) throw new Error("Failed to update listing");
  
      return await response.json();
    } catch (error) {
      console.error(error);
    }
  };
  