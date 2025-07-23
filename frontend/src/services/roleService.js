import axiosInstance from "../utils/axiosConfig";

export const getRoles = async () => {
  const response = await axiosInstance.get("/role");
  return response.data;
};
