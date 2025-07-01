import jsonServerInstance from "../api/jsonInstance";
import type { IAuction } from "../interfaces/IAuction";

export const getAuctionById = async (id: string) => {
  try {
    const response = await jsonServerInstance.get(`/auctions?id=${id}`);
    return response.data[0];
  } catch (error) {
    console.error("Error during login:", error);
  }
};

export const getAuctions = async () => {
  try {
    const response = await jsonServerInstance.get("/auctions");
    return response.data as IAuction[];
  } catch (error) {
    console.error("Error fetching auctions:", error);
    return [];
  }
};

export const createAuction = async (auction: IAuction) => {
  try {
    const response = await jsonServerInstance.post("/auctions", auction);
    return response.data;
  } catch (error) {
    console.error("Error creating auction:", error);
  }
};

export const updateAuction = async (
  id: string,
  auctionData: Partial<IAuction>
) => {
  try {
    const response = await jsonServerInstance.put(
      `/auctions/${id}`,
      auctionData
    );
    return response.data;
  } catch (error) {
    console.error("Error updating auction:", error);
  }
};

export const deleteAuction = async (id: string) => {
  try {
    await jsonServerInstance.delete(`/auctions/${id}`);
  } catch (error) {
    console.error("Error deleting auction:", error);
  }
};
