import jsonServerInstance from "../api/jsonInstance";

export const checkLogin = async (username: string) => {
  try {
    const response = await jsonServerInstance.get(
      `/users?username=${username}`
    );
    return response.data[0];
  } catch (error) {
    console.error("Error during login:", error);
  }
};
