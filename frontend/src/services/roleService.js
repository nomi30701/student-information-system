import axios from "../utils/axiosConfig";

export const getRoles = async () => {
  const response = await axios.get("/role");
  return response.data;
};
