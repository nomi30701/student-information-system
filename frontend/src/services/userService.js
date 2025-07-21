import axios from "../utils/axiosConfig";

const API_URL = `${import.meta.env.VITE_API_URL}/api/user`;

export const getUsers = async (params = {}) => {
  const { page = 1, pageSize = 10, search = "", roleId = "" } = params;
  let url = `/user?page=${page}&pageSize=${pageSize}`;

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (roleId) url += `&roleId=${roleId}`;

  const response = await axios.get(url);
  return response.data;
};

export const getAllUserNameByRoleid = async (roleId) => {
  const response = await axios.get(`/user/allUserName/${roleId}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axios.post("/user", userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axios.put(`/user/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  await axios.delete(`/user/${userId}`);
};
