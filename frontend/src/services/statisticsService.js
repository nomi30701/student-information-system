import axiosInstance from "../utils/axiosConfig";

export const getUserStatistics = async () => {
  const response = await axiosInstance.get("/statistics/users");
  return response.data;
};

export const getStudentCreditStatistics = async (studentId) => {
  const response = await axiosInstance.get(
    `/statistics/student/${studentId}/credits`
  );
  return response.data;
};
