import axiosInstance from "../utils/axiosConfig";

export const getCourses = async (params = {}) => {
  const { page = 1, pageSize = 10, search = "" } = params;
  let url = `/course?page=${page}&pageSize=${pageSize}`;

  if (search) url += `&search=${encodeURIComponent(search)}`;
  if (params.teacherId) url += `&teacherId=${params.teacherId}`;
  if (params.studentId) url += `&studentId=${params.studentId}`;

  const response = await axiosInstance.get(url);
  return response.data;
};

export const createCourse = async (courseData) => {
  const response = await axiosInstance.post(`/course`, courseData);
  return response.data;
};

export const updateCourse = async (courseId, courseData) => {
  const response = await axiosInstance.put(`/course/${courseId}`, courseData);
  return response.data;
};

export const deleteCourse = async (courseId) => {
  const response = await axiosInstance.delete(`/course/${courseId}`);
  return response.data;
};
