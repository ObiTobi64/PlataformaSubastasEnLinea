import jsonServerInstance from "../api/jsonInstance";
import type { IBid } from "../interfaces/IBid";

export const createBid = async (bid: IBid) => {
  try {
    const response = await jsonServerInstance.post("/bids", bid);

    if (!response) {
      throw new Error("Failed to save bid");
    }

    return response.data;
  } catch (error) {
    console.error("Error saving bid:", error);
    throw error;
  }
};

export const getBidsByAuctionId = async (auctionId: string) => {
  try {
    const response = await jsonServerInstance.get(
      `/bids?auctionId=${auctionId}`
    );
    if (!response) {
      throw new Error("Failed to fetch bids");
    }
    return response;
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
};
export const getBidsByUserId = async (userId: string) => {
  try {
    const response = await jsonServerInstance.get(`/bids?userId=${userId}`);
    if (!response) {
      throw new Error("Failed to fetch bids");
    }
    return response;
  } catch (error) {
    console.error("Error fetching bids:", error);
    throw error;
  }
};

export const getAllBids = async () => {
  try {
    const response = await jsonServerInstance.get("/bids");
    if (!response) {
      throw new Error("Failed to fetch all bids");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching all bids:", error);
    throw error;
  }
};

export const getBidHistoryByUserId = async (userId: string) => {
  try {
    const response = await jsonServerInstance.get(
      `/bids?userId=${userId}&_sort=timestamp&_order=desc`
    );
    if (!response) {
      throw new Error("Failed to fetch bid history");
    }
    return response.data;
  } catch (error) {
    console.error("Error fetching bid history:", error);
    throw error;
  }
};
