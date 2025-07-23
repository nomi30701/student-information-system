import axiosInstance from "../utils/axiosConfig";

export const getUsers = async (params = {}) => {
  const { page = 1, pageSize = 10, search = "", roleId = "" } = params;
  let url = `/user?page=${page}&pageSize=${pageSize}`;

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (roleId) url += `&roleId=${roleId}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const getAllUserNameByRoleid = async (roleId) => {
  const response = await axiosInstance.get(`/user/allUserName/${roleId}`);
  return response.data;
};

export const createUser = async (userData) => {
  const response = await axiosInstance.post("/user", userData);
  return response.data;
};

export const updateUser = async (userId, userData) => {
  const response = await axiosInstance.put(`/user/${userId}`, userData);
  return response.data;
};

export const deleteUser = async (userId) => {
  await axiosInstance.delete(`/user/${userId}`);
};
