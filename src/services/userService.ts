import jsonServerInstance from "../api/jsonInstance";
import type { IUser } from "../interfaces/IUser";

export const createUser = async (user: IUser) => {
  try {
    const response = await jsonServerInstance.post("/users", user);
    return response.data;
  } catch (error) {
    console.error("Error during login:", error);
  }
};
export const getUsers = async () => {
  try {
    const response = await jsonServerInstance.get("/users");
    return response.data as IUser[];
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const updateUser = async (id: string, userData: Partial<IUser>) => {
  try {
    const response = await jsonServerInstance.put(`/users/${id}`, userData);
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
  }
};

export const deleteUser = async (id: string) => {
  try {
    await jsonServerInstance.delete(`/users/${id}`);
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};
