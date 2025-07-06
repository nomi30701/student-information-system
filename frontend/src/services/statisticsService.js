import axios from "../utils/axiosConfig";

export const getUserStatistics = async () => {
  const response = await axios.get("/statistics/users");
  return response.data;
};

export const getStudentCreditStatistics = async (studentId) => {
  const response = await axios.get(`/statistics/student/${studentId}/credits`);
  return response.data;
};
